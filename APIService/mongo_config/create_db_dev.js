load("/docker-entrypoint-initdb.d/validators/identity_validator.js");
load("/docker-entrypoint-initdb.d/validators/courses_validator.js");
load("/docker-entrypoint-initdb.d/validators/blocks_validator.js");
load("/docker-entrypoint-initdb.d/validators/tokens_validator.js");

db.createCollection("identities", {
    "validator": identityValidator
});

db.createCollection("courses", {
    "validator": coursesValidator
});

db.createCollection("blocks", {
    "validator": blocksValidator
});

db.createCollection("tokens", {
    "validator": tokensValidator
});

print("Succesfully created collections: " + db.getCollectionNames().join(', '));