from hashlib import sha256
from datetime import datetime

from flask_restful import Resource
from flask import request

# from mongoengine import Document, StringField, ListField, DateTimeField, IntField, ObjectIdField, DictField

from api import mongo


# class Block(Document):
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
def get_block_by_id(block_id):
    query = {"block_id": block_id}
    block = mongo.db.blocks.find_one(query)
    return block

# Returns True or False depending on whether or not deletion was successful
def delete_block_by_id(block_id):
    query = {"block_id": block_id}
    deletion = mongo.db.blocks.delete_one(query)
    return deletion.deleted_count == 1

# Return a list of blocks that match the given arguments (arguments can be None)
def filter_blocks(owner, start_time, course_code):
    query = {}

    # TODO: Make sure Mongo schema matches these keys
    if owner is not None:
        query["owner"] = owner
    if start_time is not None:
        query["start_time"] = start_time
    if course_code is not None:
        query["course_code"] = course_code

    # TODO: This returns a Cursor object
    blocks = mongo.db.blocks.find(query)

    return blocks

# TODO: Check schema against these key names
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


# TODO: I'm not too familiar with Flask yet, would prefer to pair this part
class Block(Resource):
    # TODO: log request
    def get(self):
        if False: # TODO: Bearer token and/or API key is missing or invalid.
            return {'blocks': []}, 401

        # The following can either be a string value or None
        owner = request.args.get('owner')
        start_time = request.args.get('startTime')
        course_code = request.args.get('courseCode')

        # TODO: Query appropriate MongoDB collection

        return SOMETHING, 200
