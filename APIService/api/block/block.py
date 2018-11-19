from hashlib import sha256
from datetime import datetime

from flask_restful import Resource
from flask import request

from bson.json_util import dumps

# from mongoengine import Document, StringField, ListField, DateTimeField, IntField, ObjectIdField, DictField

from api import mongo

# TODO: Add all the auth business

# class BlockDocument(Document):
#     id            = ObjectIdField(db_field='_id')
#     block_id      = StringField(db_field='blockId')
#     course_codes  = ListField(StringField(), db_field='courseCodes', default=list)
#     owners        = ListField(StringField(), default=list)
#     comment       = StringField()
#     start_time    = DateTimeField(db_field='startTime')
#     end_time      = DateTimeField(db_field='endTime') # TODO: Redundant field
#     slot_duration = IntField(db_field='slotDuration')
#     slots         = ListField(DictField(), default=list) # TODO: DictField values aren't checked

# TODO: Can return some sort of nil value; should be handled
# TODO: Assumes blockId is unique - make sure this assumption can be made
def get_block_by_id(block_id):
    query = {"blockId": block_id}
    block = mongo.db.blocks.find_one(query)
    return block

# Returns True or False depending on whether or not deletion was successful
def delete_block_by_id(block_id):
    query = {"blockId": block_id}
    deletion = mongo.db.blocks.delete_one(query)
    return deletion.deleted_count == 1

# Return a list of blocks that match the given arguments (arguments can be None)
def filter_blocks(owner, start_time, course_code):
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

# TODO: Return value is unused
def upsert_block(block):
    upsertion = mongo.db.blocks.replace_one({'blockId': block['blockId']}, block, True) # Performs an upsert
    return upsertion.modified_count == 1


# TODO: I'm not too familiar with Flask yet, would prefer to pair this part
class Block(Resource):
    # TODO: log request
    def get(self, block_id=None):
        if False: # TODO: Bearer token and/or API key is missing or invalid.
            return {'blocks': []}, 401

        # The following can either be a string value or None
        owner = request.args.get('owner')
        start_time = request.args.get('startTime')
        course_code = request.args.get('courseCode')

        # TODO: Query appropriate MongoDB collection

        return 'yes', 200
        return dumps(get_block_by_id(owner)), 200

    def post(self, block_id=None):
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

            # DO SHIT
        
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

        upsert_block(block) # TODO: Check return value to deem transaction successful

        return 'Successfully added block.', 200

    # TODO: auth (return 'Bearer token and/or API key is missing or invalid.', 401)
    def delete(self, block_id=None):
        # DELETE /blocks/<block_id>

        if block_id is None:
            return 'Block with given blockId not found.', 400

        successful = delete_block_by_id(block_id)

        if not successful:
            return 'Block with given blockId not found.', 400
        else:
            return 'Successfully deleted block.', 200
