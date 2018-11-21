from bson.json_util import dumps
from flask_restful import Resource
from flask import request

from ..db import get_db

# TODO: App doesn't run with new DB accessor methods
# TODO: Auth (return 'Bearer token and/or API key is missing or invalid.', 401)
# TODO: Logging

class BlockDAO:
    """Provides methods for accessing objects in the Block database."""

    @staticmethod
    def get_block_by_id(block_id):
        """Return Block (`dict`) if it exists, `None` otherwise"""
        query = {'blockId': block_id}
        block = BlockDAO.get_db().blocks.find_one(query)
        BookingDAO.map_bookings(block)
        # TODO: Should strip out information depending on auth level
        return block

    @staticmethod
    def delete_block_by_id(block_id):
        """Return `True` if deletion is successful, `False` otherwise."""
        # TODO: Also delete associated bookings
        query = {'blockId': block_id}
        deletion = BlockDAO.get_db().blocks.delete_one(query)
        return deletion.deleted_count == 1

    @staticmethod
    def filter_blocks(owner=None, start_time=None, course_code=None):
        """Return a list of Block (dicts) that match the given arguments."""
        query = {}

        if start_time is not None:
            query['startTime'] = start_time

        # Convert returned Cursor object into a list
        blocks = BlockDAO.get_db().blocks.find(query)
        filtered_blocks = blocks[:]

        if owner is not None:
            filtered_blocks = filter(
                lambda block: block['owners'].contains(owner),
                filtered_blocks
            )
        if course_code is not None:
            filtered_blocks = filter(
                lambda block: block['courseCodes'].contains(course_code),
                filtered_blocks
            )

        # TODO: Should strip out information depending on auth level
        BookingDAO.map_bookings(filtered_blocks)

        return filtered_blocks

    @staticmethod
    def upsert_block(block):
        """Update given Block or insert it if it does not yet exist."""
        query = {'blockId': block['blockId']}
        BlockDAO.get_db().blocks.replace_one(query, block, upsert=True)

class BookingDAO:
    """Provides methods for accessing objects in the Booking database."""

    @staticmethod
    def get_booking_by_id(booking_id):
        """Return Booking (`dict`) if it exists, `None` otherwise."""
        query = {'_id': booking_id}
        booking = BookingDAO.get_db().bookings.find_one(query)
        # TODO: Should strip out information depending on auth level
        return booking

    @staticmethod
    def map_bookings(block):
        """Fill in given Block's slot info using the Bookings collection."""
        if block is not None:
            map(lambda slot: BookingDAO.get_booking_by_id(slot) or {},
                block['slots'])

    @staticmethod
    def book_slot(block_id, identity, slot_number, note):
        course_code = 'CSC302' # TODO: not provided - default to CSC302 for now
        query = {'block_id': block_id, 'slot_number': slot_number}

        block = BlockDAO.get_block_by_id(block_id)
        if block is not None:
            slots = block['slots']
            if slot_number >= len(slots):
                return False

            if BookingDAO.get_booking_by_id(slots[slot_number]) is not None:
                return False

            BookingDAO.get_db().bookings.insert_one({
                'utorId': identity,
                'courseCode': course_code,
                'note': note
            })

        insertion = BlockDAO.get_db().blocks.insert_one({
            'block_id': block_id,
            'identity': identity,
            'slot_number': slot_number,
            'note': note
        })

        return insertion.inserted_count == 1


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
            blocks = BlockDAO.filter_blocks(owner, start_time, course_code)
            return {'blocks': dumps(blocks)}, 200

        # GET /blocks/<block_id>
        return dumps(BlockDAO.get_block_by_id(owner)), 200

    def post(self, block_id=None):
        #################################
        # POST /blocks/<block_id>/booking
        if request.path.endswith('/booking'): # TODO: Map path properly
            if block_id is None or BlockDAO.get_block_by_id(block_id) is None:
                return Block.failure_block_id_not_found

            booking = request.get_json()
            if booking is None:
                return 'Invalid body.', 400

            identity = booking['identity']
            slot_num = booking['slot_num']
            note = booking['note']

            # TODO: Make sure block exists if previous check doesn't do the job
            block = BlockDAO.get_block_by_id(block_id)
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

        existing_block = BlockDAO.get_block_by_id(block['blockId'])
        if existing_block is None:
            # adding new block
            pass
        else:
            # editing existing block; check permissions
            if False:
                # TODO: Allow editing a block only if auth token matches owner
                return 'NOT ENOUGH PERMISSION', 401

        BlockDAO.upsert_block(block) # TODO: Successful if no mongo exceptions

        return Block.success_block_added

    def delete(self, block_id=None):
        # DELETE /blocks/<block_id>
        if block_id is None:
            return Block.failure_block_id_not_found

        successful = BlockDAO.delete_block_by_id(block_id)

        if not successful:
            return Block.failure_block_id_not_found

        return Block.success_block_deleted
