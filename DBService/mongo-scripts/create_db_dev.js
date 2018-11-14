// Passed in environment const variables: ip, port, dbName
db = connect(ip + ':' + port + '/' + dbName);

load("/docker-entrypoint-initdb.d/identity_validator.js");
load("/docker-entrypoint-initdb.d/courses_validator.js");
load("/docker-entrypoint-initdb.d/blocks_validator.js");
load("/docker-entrypoint-initdb.d/tokens_validator.js");

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