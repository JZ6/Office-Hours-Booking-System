from datetime import datetime, timedelta
from bson.json_util import dumps
from bson.objectid import ObjectId
from json import loads
from random import getrandbits
from flask_restful import Resource
from flask import request

from .block_dao import filter_blocks, get_block_by_id
from .block_dao import upsert_block, delete_block_by_id
from .block_dao import unmap_bookings, delete_bookings
from .block_dao import book_slot, delete_booking
from .block_dao import prepare_block

from ..db import get_db

# TODO: Logging


def rebook(old_booking_ids, new_bookings, block_id):
    """Return a list of booking IDs according to the new bookings."""
    # old_booking_ids is a list of booking IDs
    # new_bookings is a list of {'identity': _, 'courseCode': _, 'note': _}
    slots = []

    for i in range(min(len(old_booking_ids), len(new_bookings))):
        new_booking = new_bookings[i]
        delete_booking(block_id, i)
        if new_booking['identity'] == '' \
                and new_booking['courseCode'] == '' \
                and new_booking['note'] == '':
            slots.append(ObjectId('000000000000000000000000'))
        else:
            booking_id = book_slot(
                block_id,
                new_booking['identity'],
                i,
                new_booking['note'],
                new_booking['courseCode']
            )
            if booking_id is None:
                booking_id = ObjectId('000000000000000000000000')
            slots.append(booking_id)

    if len(old_booking_ids) > len(new_bookings):
        for i in range(len(new_bookings), len(old_booking_ids)):
            delete_booking(block_id, i)
    elif len(new_bookings) > len(old_booking_ids):
        for i in range(len(old_booking_ids), len(new_bookings)):
            booking_id = book_slot(
                block_id,
                new_booking['identity'],
                i,
                new_booking['note'],
                new_booking['courseCode']
            )
            if booking_id is None:
                booking_id = ObjectId('000000000000000000000000')
            slots.append(booking_id)

    return slots


def verify_token(auth_header):
    """If valid, return token's associated username or `None`."""
    if not auth_header:
        return None
    auth_token = auth_header.split(' ')[1] if 'Bearer ' in auth_header else ''
    if auth_token == '':
        return None
    result = get_db().tokens.find_one({'token': auth_token})
    if result is None:
        return None
    return result['utorId']


def is_admin(identity):
    """Return `True` if user has admin permissions."""
    result = get_db().identity.find_one({'id': identity})
    if result is None:
        return False
    return result['role'] == 'admin'


def is_instructor(identity):
    """Return `True` if user has instructor permissions."""
    result = get_db().identity.find_one({'id': identity})
    if result is None:
        return False
    return result['role'] == 'instructor'


class Block(Resource):
    success_booking_complete = 'Successfully booked appointment.', 200
    success_block_returned = 'Successfully returned block.', 200
    success_block_deleted = 'Successfully deleted block.', 200
    success_block_added = 'Successfully added block.', 200

    failure_invalid_body = 'Invalid request.', 400
    failure_block_not_deleted = 'Could not delete block.', 403
    failure_block_not_added = 'Could not add block.', 403
    failure_block_not_found = 'Requested block not found.', 404
    failure_booking_incomplete = 'Appointment slot is already booked.', 409

    failure_auth = 'Bearer token and/or API key is missing or invalid', 401

    def get(self, block_id=None):
        auth_header = request.headers.get('Authorization')
        identity = verify_token(auth_header)
        if not identity:
            return Block.failure_auth

        owner = request.args.get('owner') or None
        start_time = request.args.get('startTime') or None
        course_code = request.args.get('courseCode') or None

        # GET /blocks
        if block_id is None:
            blocks = filter_blocks(owner, start_time, course_code, identity)
            for block in blocks:
                prepare_block(block)
            return {'blocks': loads(dumps(blocks))}, 200  # TODO: Return a body

        # GET /blocks/<block_id>
        block = get_block_by_id(block_id, identity)
        if block is None:
            return Block.failure_block_not_found

        prepare_block(block)
        return loads(dumps(block)), 200  # TODO: Return this as body

    def post(self, block_id=None):
        auth_header = request.headers.get('Authorization')
        identity = verify_token(auth_header)
        if not identity:
            return Block.failure_auth

        # POST /blocks/<block_id>/booking
        if request.path.endswith('/booking'):  # TODO: Map path properly
            if block_id is None or get_block_by_id(block_id, identity) is None:
                return Block.failure_block_not_found

            booking = request.get_json()
            if booking is None \
                    or 'identity' not in booking \
                    or 'startTime' not in booking \
                    or 'courseCode' not in booking \
                    or 'note' not in booking:
                return Block.failure_invalid_body

            utor_id = booking['identity']
            slot_num = booking['startTime']
            note = booking['note']
            course_code = booking['courseCode'].upper()
            if course_code == '' and utor_id != '':
                return Block.failure_invalid_body

            block = get_block_by_id(block_id)
            slots = block['slots']
            slot = slots[slot_num]
            # Clear a booking
            if utor_id == '' and note == '':
                if identity != slot['utorId'] \
                        and not is_admin(identity) \
                        and identity not in block['owners']:
                    return Block.failure_auth

                success = delete_booking(block_id, slot_num)
                if success:
                    return Block.success_booking_complete
                else:
                    return Block.failure_booking_incomplete

            # If it exists, delete slot in order to re-add new values (edit)
            if slot['utorId'] != '' \
                    and (slot['utorId'] == identity \
                    or is_admin(identity) \
                    or is_instructor(identity)):
                success = delete_booking(block_id, slot_num)
                if not success:
                    return Block.failure_booking_incomplete

            # Create a new booking
            insertion_id = \
                book_slot(block_id, utor_id, slot_num, note, course_code)
            if insertion_id is None:
                return Block.failure_booking_incomplete

            return Block.success_booking_complete

        # POST /blocks
        block = request.get_json()
        if block is None:
            return Block.failure_invalid_body

        if 'blockId' not in block:
            return Block.failure_invalid_body

        existing_block = get_block_by_id(block['blockId'])
        if existing_block is None or block['blockId'] == '':
            if not is_admin(identity) and not is_instructor(identity):
                return Block.failure_auth

            # Add a new block; make sure all fields are included
            block['blockId'] = str(getrandbits(128))  # TODO: For now

            if 'owners' not in block \
                    or 'courseCodes' not in block \
                    or 'comment' not in block \
                    or 'startTime' not in block \
                    or 'appointmentDuration' not in block \
                    or 'appointmentSlots' not in block:
                return Block.failure_invalid_body

            if len(block['owners']) == 0:
                block['owners'].append(identity)  # TODO: Workaround

            if len(block['courseCodes']) == 0:
                block['courseCodes'].append('CSC302')  # TODO: Workaround

            # Remap some field names and calculate endTime
            block['slotDuration'] = block.pop('appointmentDuration')
            # NOTE: Assume new blocks are always created with no bookings
            block['slots'] = []
            for slot in block.pop('appointmentSlots'):
                block['slots'].append(ObjectId('000000000000000000000000'))
            block['startTime'] = datetime.strptime(
                block['startTime'], '%Y-%m-%dT%H:%M:%S.%fZ'
            ) - timedelta(hours=5)  # TODO: Terrible hack; no DST anytime soon
            block['endTime'] = block['startTime'] + timedelta(
                milliseconds=block['slotDuration'] * len(block['slots'])
            )

        else:
            # Editing an existing block; check permissions using identity
            if not is_admin(identity) \
                    and identity not in existing_block['owners']:
                return Block.failure_auth

            unmap_bookings(existing_block)

            # Owners
            if 'owners' not in block:
                block['owners'] = existing_block['owners']

            # Course code
            if 'courseCodes' not in block:
                block['courseCodes'] = existing_block['courseCodes']

            # Comment
            if 'comment' not in block:
                block['comment'] = existing_block['comment']

            # Slot duration
            if 'appointmentDuration' not in block:
                block['slotDuration'] = existing_block['slotDuration']
            else:
                block['slotDuration'] = block.pop('appointmentDuration')

            # Slots
            # TODO: Recalculate endTime (low priority; not used anywhere)
            if 'appointmentSlots' not in block:
                # Keep old bookings
                block['slots'] = existing_block['slots']
            else:
                # Make sure all provided courseCode fields are non-empty
                for slot in block['appointmentSlots']:
                    if slot['courseCode'] == '' and slot['identity'] != '':
                        return Block.failure_invalid_body

                block['slots'] = rebook(
                    existing_block['slots'],
                    block['appointmentSlots'],
                    block['blockId']
                )
                block.pop('appointmentSlots')

            # Start time
            if 'startTime' not in block:
                block['startTime'] = existing_block['startTime']
            else:
                block['startTime'] = datetime.strptime(
                    block['startTime'],
                    '%Y-%m-%dT%H:%M:%S.%fZ'
                ) - timedelta(hours=5)  # TODO: Terrible hack

            # End time
            if 'endTime' not in block:
                block['endTime'] = existing_block['endTime']
            else:
                block['endTime'] = block['startTime'] + timedelta(
                    milliseconds=block['slotDuration'] * len(block['slots'])
                )

        upsert_block(block)  # TODO: Successful if no mongo exceptions
        return Block.success_block_added

    def delete(self, block_id=None):
        auth_header = request.headers.get('Authorization')
        identity = verify_token(auth_header)
        if not identity:
            return Block.failure_auth

        block = get_block_by_id(block_id)
        if block is None:
            return Block.failure_block_not_found
        # Fail if user is not an instructor/ta
        if not is_admin(identity) and identity not in block['owners']:
            return Block.failure_block_not_deleted

        # DELETE /blocks/<block_id>
        if block_id is None:
            return Block.failure_block_not_deleted

        successful = delete_block_by_id(block_id)
        if not successful:
            return Block.failure_block_not_deleted

        return Block.success_block_deleted
