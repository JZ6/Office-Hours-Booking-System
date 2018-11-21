# Provides methods for accessing objects in the Booking database

from ..db import get_db
from block_dao import get_block_by_id


def get_booking_by_id(booking_id):
    """Return Booking (`dict`) if it exists, `None` otherwise."""
    query = {'_id': booking_id}
    booking = get_db().bookings.find_one(query)
    # TODO: Should strip out information depending on auth level
    return booking


def map_bookings(block):
    """Fill in given Block's slot info using the Bookings collection."""
    if block is not None:
        map(lambda slot: get_booking_by_id(slot) or {},
            block['slots'])


def book_slot(block_id, identity, slot_number, note):
    course_code = 'CSC302'  # TODO: not provided; default to CSC302 for now
    query = {'block_id': block_id, 'slot_number': slot_number}

    block = get_block_by_id(block_id)
    if block is not None:
        slots = block['slots']
        if slot_number >= len(slots):
            return False

        if get_booking_by_id(slots[slot_number]) is not None:
            return False

        get_db().bookings.insert_one({
            'utorId': identity,
            'courseCode': course_code,
            'note': note
        })

    insertion = get_db().blocks.insert_one({
        'block_id': block_id,
        'identity': identity,
        'slot_number': slot_number,
        'note': note
    })

    return insertion.inserted_count == 1
