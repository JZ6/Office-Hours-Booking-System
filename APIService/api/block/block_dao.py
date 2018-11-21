# Provides methods for accessing objects in the Block database

from ..db import get_db
from booking_dao import map_bookings


def get_block_by_id(block_id):
    """Return Block (`dict`) if it exists, `None` otherwise"""
    query = {'blockId': block_id}
    block = get_db().blocks.find_one(query)
    map_bookings(block)
    # TODO: Should strip out information depending on auth level
    return block


def delete_block_by_id(block_id):
    """Return `True` if deletion is successful, `False` otherwise."""
    # TODO: Also delete associated bookings
    query = {'blockId': block_id}
    deletion = get_db().blocks.delete_one(query)
    return deletion.deleted_count == 1


def filter_blocks(owner=None, start_time=None, course_code=None):
    """Return a list of Block (dicts) that match the given arguments."""
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

    # TODO: Should strip out information depending on auth level
    map_bookings(filtered_blocks)

    return filtered_blocks


def upsert_block(block):
    """Update given Block or insert it if it does not yet exist."""
    query = {'blockId': block['blockId']}
    get_db().blocks.replace_one(query, block, upsert=True)
