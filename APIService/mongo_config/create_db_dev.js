try {
    cd('mongo_config');
} catch (err) {
    cd('docker-entrypoint-initdb.d');
}

load(pwd() + "/validators/validators.js");

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