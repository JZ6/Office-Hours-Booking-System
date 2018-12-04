# Provides methods for accessing objects in the Mongo database
# NOTE: These methods assume authorization is granted for all requests

from bson.objectid import ObjectId
from ..db import get_db


def get_block_by_id(block_id, utor_id=None):
    """Return user-limited Block data if it exists, `None` otherwise."""
    query = {'blockId': block_id}
    block = get_db().blocks.find_one(query)
    if block is not None:
        map_bookings(block, utor_id)
    return block


def delete_block_by_id(block_id):
    """Return `True` if deletion is successful, `False` otherwise."""
    query = {'blockId': block_id}
    block_deletion = get_db().blocks.delete_one(query)

    # TODO: Make sure no accidental booking deletions can happen here
    return block_deletion.deleted_count == 1 and delete_bookings(block_id)


def delete_bookings(block_id):
    """Clear bookings made under a block and return `True` if successful."""
    block = get_block_by_id(block_id)
    if block is None:
        return False

    bookings = block['slots'] if 'slots' in block else []
    success = True
    for booking_id in bookings:
        query = {'_id': booking_id}
        deletion = get_db().bookings.delete_one(query)
        success = success and (deletion.deleted_count == 1)
    return success


def filter_blocks(owner=None, start_time=None, course_code=None, utor_id=None):
    """Return a list of Blocks that match the given arguments."""
    query = {}

    if start_time is not None:
        query['startTime'] = start_time

    # Convert returned Cursor object into a list
    blocks = get_db().blocks.find(query)
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

    map_bookings(filtered_blocks, utor_id)

    return filtered_blocks


def upsert_block(block):
    """Upsert given Block and return the result."""
    query = {'blockId': block['blockId']}
    return get_db().blocks.replace_one(query, block, upsert=True)


def get_booking_by_id(booking_id, utor_id=None):
    """Return Booking if it exists, `None` otherwise."""
    query = {'_id': booking_id}
    booking = get_db().bookings.find_one(query)
    if booking is not None and utor_id is not None:
        if booking['utorId'] != utor_id:
            booking['utorId'] = ''
            booking['courseCode'] = ''  # TODO: Should this not be masked?
            booking['note'] = ''
    return booking


def map_bookings(block, utor_id=None):
    """Fill in given Block's slot info using the Bookings collection."""
    map(lambda slot: get_booking_by_id(slot, utor_id) or {},
        block['slots'])


def unmap_bookings(block):
    """Remove booking details from given Block, to prepare for DB insertion."""
    if block is not None:
        # While unbooked, slots are empty dictionary objects
        map(lambda slot: slot['_id'] if '_id' in slot
            else ObjectId('000000000000000000000000'),
            block['slots'])


def book_slot(block_id, identity, slot_number, note):
    """Create a Booking and return `True` if successful, `False` otherwise."""
    block = get_block_by_id(block_id)
    if block is None:
        return False

    # TODO: courseCode not provided; default to Block's data
    course_codes = block['courseCodes']
    course_code = course_codes[0] if len(course_codes) > 0 else ''

    slots = block['slots']
    if slot_number >= len(slots):
        return False

    if slots[slot_number] != {}:
        return False

    insertion = get_db().bookings.insert_one({
        'utorId': identity,
        'courseCode': course_code,
        'note': note
    })

    if insertion.inserted_count != 1:
        return False

    # I add only the `_id` field since the next step is to strip booking data
    block['slots'][slot_number] = {'_id': insertion.inserted_id}
    unmap_bookings(block)
    update = upsert_block(block)

    return update.upserted_count == 1
