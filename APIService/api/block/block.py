from bson.json_util import dumps
from flask_restful import Resource
from flask import request

from .block_dao import filter_blocks, get_block_by_id
from .block_dao import upsert_block, delete_block_by_id

# TODO: Logging
# TODO: Proper codes https://en.wikipedia.org/wiki/List_of_HTTP_status_codes


class Block(Resource):
    failure_block_id_not_found = 'Block with given blockId not found.', 404
    failure_block_not_deleted = 'Block could not be deleted.', 400
    failure_booking_incomplete = 'Appointment slot could not be booked.', 409
    success_booking_complete = 'Successfully booked appointment slot.', 200
    success_block_deleted = 'Successfully deleted block.', 200
    success_block_added = 'Successfully added block.', 200
    failure_invalid_body = 'Invalid body.', 400

    def get(self, block_id=None):
        identity = None  # TODO: Determine identity

        owner = request.args.get('owner') or None
        start_time = request.args.get('startTime') or None
        course_code = request.args.get('courseCode') or None

        # GET /blocks
        if block_id is None:
            blocks = filter_blocks(owner, start_time, course_code, identity)
            return {'blocks': dumps(blocks)}, 200

        # GET /blocks/<block_id>
        return dumps(get_block_by_id(block_id, identity)), 200

    def post(self, block_id=None):
        identity = None  # TODO: Determine identity

        # POST /blocks/<block_id>/booking
        if request.path.endswith('/booking'):  # TODO: Map path properly
            if block_id is None or get_block_by_id(block_id, identity) is None:
                return Block.failure_block_id_not_found

            booking = request.get_json()
            if booking is None \
                    or 'identity' not in booking \
                    or 'slot_num' not in booking \
                    or 'note' not in booking:
                return Block.failure_invalid_body

            identity = booking['identity']
            slot_num = booking['slot_num']  # TODO: Check if conversion needed
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
            return failure_invalid_body

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
                return failure_invalid_body

            # Remap some field names and calculate endTime
            block['slotDuration'] = block.pop('appointmentDuration')
            block['slots'] = block.pop('appointmentSlots')
            block['endTime'] = block['startTime'] + \
                block['appointmentDuration'] * len(block['appointmentSlots'])

        else:
            # Editing an existing block; check permissions using identity
            if False:
                # TODO: Allow editing a block only if auth token matches owner
                return 'NOT ENOUGH PERMISSION', 401

            if 'blockId' not in block:
                block['blockId'] = existing_block['blockId']
            if 'owners' not in block:
                block['owners'] = existing_block['owners']
            if 'courseCodes' not in block:
                block['courseCodes'] = existing_block['courseCodes']
            if 'comment' not in block:
                block['comment'] = existing_block['comment']
            if 'startTime' not in block:
                block['startTime'] = existing_block['startTime']

            block['slotDuration'] = block.pop('appointmentDuration') \
                if 'appointmentDuration' in block \
                else existing_block['slotDuration']

            block['slots'] = block.pop('appointmentSlots') \
                if 'appointmentSlots' in block \
                else existing_block['slots']

            block['endTime'] = block['startTime'] + \
                block['appointmentDuration'] * len(block['appointmentSlots'])

        upsert_block(block)  # TODO: Successful if no mongo exceptions
        return Block.success_block_added

    def delete(self, block_id=None):
        identity = None  # TODO: Determine identity

        # DELETE /blocks/<block_id>
        if block_id is None:
            return Block.failure_block_id_not_found

        # TODO: Check to make sure this user is permitted to delete the block
        successful = delete_block_by_id(block_id, identity)
        if not successful:
            return Block.failure_block_not_deleted

        return Block.success_block_deleted
