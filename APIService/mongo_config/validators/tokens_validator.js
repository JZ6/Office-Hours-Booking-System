const tokensValidator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "utorId",
            "token",
            "creation",
            "expiration"
        ],
        "additionalProperties": false,
        "properties": {
            "_id": {
                "bsonType": "objectId",
            },
            "utorId": {
                "bsonType": "string",
                "pattern": "[a-z0-9]+"
            },
            "token": {
                "bsonType": "string"
            },
            "creation": {
                "bsonType": "date"
            },
            "expiration": {
                "bsonType": "date"
            }
        }
    }
}