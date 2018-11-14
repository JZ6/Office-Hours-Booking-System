This dockerfile creates a MongoDB Container `db-service` that hosts database
`devDB` which includes validated __empty__ collections `identities`, `courses`,
`blocks`, and `tokens`.

# Build DBService Image and Run DBService Container
In `/DBService` run
```
docker build -t db-service:dev --rm .
```
then,
```
docker run -p 27017:27017 --name=db-service db-service:dev
```

# Access devDB
On host with container `db-service` running in another terminal,
```
docker exec -it db-service bash
```
then,
```
mongo localhost
```
and now,
```
use DevDB
```
allowing us to view the empty validated collections via
```
db.getCollectionNames()
```

# Next Step
* Define our multi-container Docker application with `docker-compose.yml`
  allowing inter-container communication.
* Generate mock data.