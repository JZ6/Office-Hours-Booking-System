from api import mongo
from bson.json_util import dumps
from flask_restful import Resource
from flask import request

# TODO: Add all the auth business
# TODO: auth (return 'Bearer token and/or API key is missing or invalid.', 401)
if False: # TODO: Bearer token and/or API key is missing or invalid.
    return {'blocks': []}, 401
# TODO: log requests

# Return Block (dict) if it exists, None otherwise
def get_block_by_id(block_id):
    query = {"blockId": block_id}
    block = mongo.db.blocks.find_one(query)
    return block

# Return True if deletion successful, False otherwise
def delete_block_by_id(block_id):
    query = {"blockId": block_id}
    deletion = mongo.db.blocks.delete_one(query)
    return deletion.deleted_count == 1

# Return a list of Block (dicts) that match the given optional arguments
def get_filtered_blocks(owner=None, start_time=None, course_code=None):
    query = {}

    if start_time is not None:
        query["startTime"] = start_time

    # Convert returned Cursor object into a list
    blocks = mongo.db.blocks.find(query)
    filtered_blocks = blocks[:]

    if owner is not None:
        filtered_blocks = filter(
            lambda block: block["owners"].contains(owner),
            filtered_blocks
        )
    if course_code is not None:
        filtered_blocks = filter(
            lambda block: block["courseCodes"].contains(course_code),
            filtered_blocks
        )

    return filtered_blocks

def book_slot(block_id, identity, slot_number, note):
    query = {'block_id': block_id, 'slot_number': slot_number}

    # TODO: Figure out where slots reside in the DB
    # The slot in the given block is already filled
    if mongo.db.blocks.find_one(query) is not None:
        return False

    mongo.db.blocks.insert_one({
        "block_id": block_id,
        "identity": identity,
        "slot_number": slot_number,
        "note": note
    })

    return True

# Update given Block or insert it if it does not yet exist; return None
def upsert_block(block):
    query = {'blockId': block['blockId']}
    mongo.db.blocks.replace_one(query, block, upsert=True)


class Block(Resource):
    def get(self, block_id=None):

        # The following can either be a string value or None
        owner = request.args.get('owner')
        start_time = request.args.get('startTime')
        course_code = request.args.get('courseCode')

        #############
        # GET /blocks
        if block_id is None:
            blocks = get_filtered_blocks(owner, start_time, course_code)
            return {'blocks': dumps(blocks)}, 200

        ########################
        # GET /blocks/<block_id>
        return dumps(get_block_by_id(owner)), 200

    def post(self, block_id=None):
        #################################
        # POST /blocks/<block_id>/booking
        if request.path.endswith('/booking'): # TODO: Map path properly with Flask
            if block_id is None or get_block_by_id(block_id) is None:
                return 'Block with given blockId not found.', 400

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
            return 'DIDNT GIMME SHIT', 400

        block['endTime'] = "2020-09-15T15:53:00" # TODO: Calculate endTime; revise the API; endTime should be provided
        block['slotDuration'] = block.pop('appointmentDuration')
        block['slots'] = block.pop('appointmentSlots')

        existing_block = get_block_by_id(block['blockId'])
        if existing_block is None:
            # adding new block
            pass
        else:
            # editing existing block; check permissions
            if False: # TODO: Allow editing of a block only if one of the owners and the auth token's holder match
                return "NOT ENOUGH PERMISSION", 401

        upsert_block(block) # TODO: So long as no mongo exceptions; successful

        return 'Successfully added block.', 200

    def delete(self, block_id=None):
        ###########################
        # DELETE /blocks/<block_id>
        if block_id is None:
            return 'Block with given blockId not found.', 400

        successful = delete_block_by_id(block_id)

        if not successful:
            return 'Block with given blockId not found.', 400
        else:
            return 'Successfully deleted block.', 200
