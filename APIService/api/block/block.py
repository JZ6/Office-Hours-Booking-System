from datetime import datetime, timedelta
from bson.json_util import dumps
from bson.objectid import ObjectId
from json import loads
from flask_restful import Resource
from flask import request

from .block_dao import filter_blocks, get_block_by_id
from .block_dao import upsert_block, delete_block_by_id
from .block_dao import unmap_bookings, delete_bookings
from .block_dao import book_slot
from .block_dao import prepare_block

# TODO: Logging


class Block(Resource):
    success_booking_complete   = 'Successfully booked appointment.',    200
    success_block_returned     = 'Successfully returned block.',        200
    success_block_deleted      = 'Successfully deleted block.',         200
    success_block_added        = 'Successfully added block.',           200

    failure_invalid_body       = 'Invalid request.',                    400
    failure_block_not_deleted  = 'Could not delete block.',             403
    failure_block_not_added    = 'Could not add block.',                403
    failure_block_not_found    = 'Requested block not found.',          404
    failure_booking_incomplete = 'Appointment slot is already booked.', 409

    failure_auth = 'Bearer token and/or API key is missing or invalid', 401

    def get(self, block_id=None):
        identity = None  # TODO: Determine identity
        # TODO: Check to make sure identity is provided
        if False:
            return Block.failure_auth

        owner = request.args.get('owner') or None
        start_time = request.args.get('startTime') or None
        course_code = request.args.get('courseCode') or None

        # GET /blocks
        if block_id is None:
            blocks = filter_blocks(owner, start_time, course_code, identity)
            for block in blocks:
                prepare_block(block)
            return {'blocks': loads(dumps(blocks))}, 200  # TODO: Return as body

        # GET /blocks/<block_id>
        block = get_block_by_id(block_id, identity)
        if block is None:
            return Block.failure_block_not_found

        prepare_block(block)
        return loads(dumps(block)), 200  # TODO: Return this as body

    def post(self, block_id=None):
        identity = None  # TODO: Determine identity
        # TODO: Check to make sure identity is provided
        if False:
            return Block.failure_auth

        # POST /blocks/<block_id>/booking
        if request.path.endswith('/booking'):  # TODO: Map path properly
            if block_id is None or get_block_by_id(block_id, identity) is None:
                return Block.failure_block_not_found

            booking = request.get_json()
            if booking is None \
                    or 'identity' not in booking \
                    or 'slotNum' not in booking \
                    or 'note' not in booking:
                return Block.failure_invalid_body

            identity = booking['identity']
            slot_num = booking['slotNum']
            note = booking['note']

            successful = book_slot(block_id, identity, slot_num, note)
            if not successful:
                return Block.failure_booking_incomplete

            return Block.success_booking_complete

        # POST /blocks
        block = request.get_json()
        if block is None:
            return Block.failure_invalid_body

        if 'blockId' not in block:
            return Block.failure_invalid_body

        # Massage Block data so it can be saved
        existing_block = get_block_by_id(block['blockId'])
        if existing_block is None:
            # Add a new block; make sure all fields are included
            if 'owners' not in block \
                    or 'courseCodes' not in block \
                    or 'comment' not in block \
                    or 'startTime' not in block \
                    or 'appointmentDuration' not in block \
                    or 'appointmentSlots' not in block:
                return Block.failure_invalid_body

            # Remap some field names and calculate endTime
            block['slotDuration'] = block.pop('appointmentDuration')
            block['slots'] = []
            for slot in block.pop('appointmentSlots'):
                block['slots'].append(ObjectId('000000000000000000000000'))
            block['startTime'] = datetime.strptime(
                block['startTime'], "%Y-%m-%dT%H:%M:%S"
            )
            block['endTime'] = block['startTime'] + timedelta(
                milliseconds=block['slotDuration'] * len(block['slots'])
            )

        else:
            # Editing an existing block; check permissions using identity
            # TODO: Make sure user is permitted to delete the block (owner)
            if False:
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
            if 'appointmentSlots' not in block:
                block['slots'] = []
                for _ in range(len(existing_block['slots'])):
                    block['slots'].append(ObjectId('000000000000000000000000'))
            else:
                block['slots'] = []
                for _ in range(len(block.pop('appointmentSlots'))):
                    block['slots'].append(ObjectId('000000000000000000000000'))

            # Start time
            if 'startTime' not in block:
                block['startTime'] = existing_block['startTime']
            else:
                block['startTime'] = \
                    datetime.strptime(block['startTime'], "%Y-%m-%dT%H:%M:%S")

            # End time
            if 'endTime' not in block:
                block['endTime'] = existing_block['endTime']
            else:
                block['endTime'] = block['startTime'] + timedelta(
                    milliseconds=block['slotDuration'] * len(block['slots'])
                )

        delete_bookings(block['blockId'])
        upsert_block(block)  # TODO: Successful if no mongo exceptions
        return Block.success_block_added

    def delete(self, block_id=None):
        identity = None  # TODO: Determine identity
        # TODO: Check to make sure identity is provided
        if False:
            return Block.failure_auth

        # DELETE /blocks/<block_id>
        if block_id is None:
            return Block.failure_block_not_deleted

        # TODO: Check to make sure this user is permitted to delete the block
        if False:
            return Block.failure_auth

        successful = delete_block_by_id(block_id)
        if not successful:
            return Block.failure_block_not_deleted

        return Block.success_block_deleted
