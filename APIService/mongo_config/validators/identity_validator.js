const identityValidator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "utorId",
            "studentNumber",
            "firstName",
            "lastName",
            "role",
            "courses"
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
            "studentNumber": {
                "bsonType": "string"
            },
            "firstName": {
                "bsonType": "string"
            },
            "lastName": {
                "bsonType": "string"
            },
            "role": {
                "bsonType": "string",
                "enum": [
                    "student",
                    "instructor",
                    "ta"
                ]
            },
            "courses": {
                "bsonType": "array",
                "uniqueItems": true,
                "items": {
                    "bsonType": "string",
                    "pattern": "[A-Z]{3}[0-9]{3}",
                }
            }
        }
    }
}