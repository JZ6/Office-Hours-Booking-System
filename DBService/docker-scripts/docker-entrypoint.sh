#!/bin/bash

echo "[ DBSERVICE ENTRY POINT BEGIN ]"
echo "Starting mongod instance..."
mongod --port ${MONGO_PORT} --bind_ip ${MONGO_IP} --quiet &
sleep 2 # Really should be waiting for a return value, this will do for now.
echo "mongod instance started!"
echo "Creating EMPTY Mongo database ${MONGO_DBNAME} with validators..."
mongo --eval "const ip = '${MONGO_IP}'; const port = '${MONGO_PORT}'; const dbName = '${MONGO_DBNAME}';" /docker-entrypoint-initdb.d/create_db_dev.js &&
echo "Mongo database ${MONGO_DBNAME} created!"
echo "[ DBSERVICE ENTRY POINT END ]"
mongod --shutdown
exec mongod --port ${MONGO_PORT} --bind_ip ${MONGO_IP} --quiet
