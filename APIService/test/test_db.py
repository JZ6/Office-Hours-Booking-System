import datetime
import json
import os
import time
import unittest

from pymongo import MongoClient

"""
Test the methods of initializing an empty test database.
"""


class DatabaseAndCollectionCreationTestCase(unittest.TestCase):

    """
    Setup an empty database for running tests.
    """

    def setUp(self):
        timestamp = time.time()
        testtime = ((datetime.datetime.fromtimestamp(timestamp))
                    .strftime('%Y-%m-%d-%H:%M:%S'))

        self.dbname = 'testDB-' + testtime

        uri = 'mongodb+srv://dev:koolaid-devs@koolaidkluster-9lhh0.mongodb.net'

        self.client = MongoClient(uri)
        self.db = self.client[self.dbname]

    """
    Destroy the test database after running tests.
    """

    def tearDown(self):
        self.db.command('dropDatabase')

    """
    Test the creation and setting parameters of the Users collection.
    """

    def test_create_users_collection(self):
        fd = open('db_config/validators/users_validator.json')
        validator_json = json.load(fd)
        fd.close()

        rv = self.db.command('create', 'users', validator=validator_json,
                             validationLevel='strict',
                             validationAction='error')

        self.db['users'].create_index('utorId')

        self.assertIn('ok', rv.keys())

    """
    Test the creation and setting parameters of the Courses collection.
    """

    def test_create_courses_collection(self):
        fd = open('db_config/validators/courses_validator.json')
        validator_json = json.load(fd)
        fd.close()

        rv = self.db.command('create', 'courses', validator=validator_json,
                             validationLevel='strict',
                             validationAction='error')

        self.db['courses'].create_index('courseCode')

        self.assertIn('ok', rv.keys())

    """
    Test the creation and setting parameters of the Blocks collection.
    """

    def test_create_blocks_collection(self):
        fd = open('db_config/validators/blocks_validator.json')
        validator_json = json.load(fd)
        fd.close()

        rv = self.db.command('create', 'blocks', validator=validator_json,
                             validationLevel='strict',
                             validationAction='error')

        self.db['blocks'].create_index('courseCode')

        self.assertIn('ok', rv.keys())

    """
    Test the creation and setting parameters of the Tokens collection.
    """

    def test_create_tokens_collection(self):
        fd = open('db_config/validators/tokens_validator.json')
        validator_json = json.load(fd)
        fd.close()

        rv = self.db.command('create', 'tokens', validator=validator_json,
                             validationLevel='strict',
                             validationAction='error')

        self.db['tokens'].create_index('token')

        self.assertIn('ok', rv.keys())


if __name__ == '__main__':
    unittest.main()