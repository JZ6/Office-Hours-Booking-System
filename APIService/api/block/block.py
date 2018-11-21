from bson.json_util import dumps
from flask_restful import Resource
from flask import request

from block_dao import filter_blocks, get_block_by_id
from block_dao import upsert_block, delete_block_by_id

# TODO: App doesn't run with new DB accessor methods
# TODO: Auth (return 'Bearer token and/or API key is missing or invalid.', 401)
# TODO: Logging
# TODO: Move DAO methods to their own file; get rid of classes


class Block(Resource):
    failure_block_id_not_found = 'Block with given blockId not found.', 404
    success_block_deleted = 'Successfully deleted block.', 200
    success_block_added = 'Successfully added block.', 200

    def get(self, block_id=None):
        # The following can either be a string value or None
        owner = request.args.get('owner')
        start_time = request.args.get('startTime')
        course_code = request.args.get('courseCode')

        # GET /blocks
        if block_id is None:
            blocks = filter_blocks(owner, start_time, course_code)
            return {'blocks': dumps(blocks)}, 200

        # GET /blocks/<block_id>
        return dumps(get_block_by_id(owner)), 200

    def post(self, block_id=None):
        #################################
        # POST /blocks/<block_id>/booking
        if request.path.endswith('/booking'):  # TODO: Map path properly
            if block_id is None or get_block_by_id(block_id) is None:
                return Block.failure_block_id_not_found

            booking = request.get_json()
            if booking is None:
                return 'Invalid body.', 400

            identity = booking['identity']
            slot_num = booking['slot_num']
            note = booking['note']

            # TODO: Make sure block exists if previous check doesn't do the job
            block = get_block_by_id(block_id)
            if False:
                return 'OWNER PROBLEM', 401

            # TODO: Fix API then fix logic
            return 'NOT IMPLEMENTED', 200
            return 'Appointment slot is already booked.', 409

        ##############
        # POST /blocks
        block = request.get_json()
        if block is None:
            return 'Invalid block provided.', 400

        # TODO: Calculate endTime with revised API
        block['endTime'] = '2020-09-15T15:53:00'
        block['slotDuration'] = block.pop('appointmentDuration')
        block['slots'] = block.pop('appointmentSlots')

        existing_block = get_block_by_id(block['blockId'])
        if existing_block is None:
            # adding new block
            pass
        else:
            # editing existing block; check permissions
            if False:
                # TODO: Allow editing a block only if auth token matches owner
                return 'NOT ENOUGH PERMISSION', 401

        upsert_block(block)  # TODO: Successful if no mongo exceptions

        return Block.success_block_added

    def delete(self, block_id=None):
        # DELETE /blocks/<block_id>
        if block_id is None:
            return Block.failure_block_id_not_found

        successful = delete_block_by_id(block_id)

        if not successful:
            return Block.failure_block_id_not_found

        return Block.success_block_deleted
