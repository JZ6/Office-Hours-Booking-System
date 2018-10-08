# Api.md

## Goal
Design the APIs supported by the Ticket, Applicant (etc) endpoints.

## Design
Please refer to (OpenAPI.md)[doc/phase1/OpenApi.md] for details.

## Handout

You will follow Bezos dictum for your project. Clients will use endpoints to get, put, update the details of applicant, course and the other model objects required.

Note this does not mean that you must write all UI in JavaScript libraries like React. Suppose you decide to build a simple HTML client served by your favourite Java infrastructure (Tomcat?). Bezos’ dictum would prohibit, for instance, a Tomcat server code populating an HTML template by querying the database “behind the back” of the web service that serves applicants. However, if the tomcat code called the “official” endpoint to populate its HTML template that would be fine.
