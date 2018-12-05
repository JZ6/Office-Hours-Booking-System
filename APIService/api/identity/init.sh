#!/bin/bash

USER1_JSON="{ \"id\": \"user1\", \"studentNumber\": 1111111111, \"firstName\": \"John\", \"lastName\": \"Doe\", \"role\": \"student\", \"courses\": [ \"csc300\", \"csc301\", \"csc302\" ] }"
USER2_JSON="{ \"id\": \"user2\", \"studentNumber\": 2222222222, \"firstName\": \"Alice\", \"lastName\": \"Bobbert\", \"role\": \"student\", \"courses\": [ \"csc300\", \"csc301\", \"csc302\" ] }"
ADMIN_JSON="{ \"id\": \"admin\", \"studentNumber\": 1231231230, \"firstName\": \"Bob\", \"lastName\": \"Ross\", \"role\": \"instructor\", \"courses\": [ \"csc300\", \"csc301\", \"csc302\" ] }"

curl \
  --header "Content-Type: application/json" \
  --request POST \
  --data "$ADMIN_JSON" \
  '127.0.0.1:5001/identity/admin'

curl \
  --header "Content-Type: application/json" \
  --request POST \
  --data "$USER1_JSON" \
  '127.0.0.1:5001/identity/user1'

curl \
  --header "Content-Type: application/json" \
  --request POST \
  --data "$USER2_JSON" \
  '127.0.0.1:5001/identity/user2'
