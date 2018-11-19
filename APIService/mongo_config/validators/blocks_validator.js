const blocksValidator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "blockId",
            "courseCodes",
            "owners",
            "comment",
            "startTime",
            "endTime",
            "slotDuration",
            "slots"
        ],
        "additionalProperties": false,
        "properties": {
            "_id": {
                "bsonType": "objectId",
            },
            "blockId": {
                "bsonType": "string"
            },
            "courseCodes": {
                "bsonType": "array",
                "minItems": 1,
                "items": {
                    "bsonType": "string",
                    "pattern": "[A-Z]{3}[0-9]{3}"
                }
            },
            "owners": {
                "bsonType": "array",
                "minItems": 1,
                "items": {
                    "bsonType": "string",
                    "pattern": "[a-z0-9]+"
                }
            },
            "comment": {
                "bsonType": "string"
            },
            "startTime": {
                "bsonType": "date"
            },
            "endTime": {
                "bsonType": "date"
            },
            "slotDuration": {
                "bsonType": "int"
            },
            "slots": {
                "bsonType": "array",
                "items": {
                    "bsonType": "object",
                    "required": [
                        "utorId",
                        "courseCode",
                        "note"
                    ],
                    "additionalProperties": false,
                    "properties": {
                        "utorId": {
                            "bsonType": "string",
                            "pattern": "[a-z0-9]+"
                        },
                        "courseCode": {
                            "bsonType": "string",
                            "pattern": "[A-Z]{3}[0-9]{3}"
                        },
                        "note": {
                            "bsonType": "string"
                        }
                    }
                }
            }
        }
    }
}