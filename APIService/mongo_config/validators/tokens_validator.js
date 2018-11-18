const tokensValidator = {
    "title": "utorId and token association.",
    "bsonType": "object",
    "required": [
        "utorId",
        "token",
        "creation",
        "expiration"
    ],
    "additionalProperties": false,
    "properties": {
        "utorId": {
            "bsonType": "string",
            "pattern": "[a-z0-9]+",
            "title": "The utorId of this user."
        },
        "token": {
            "bsonType": "string",
            "title": "The token."
        },
        "creation": {
            "bsonType": "date",
            "description": "The creation datetime for this token."
        },
        "expiration": {
            "bsonType": "date",
            "title": "The expiration datetime for this token."
        }
    }
};