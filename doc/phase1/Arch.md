# Arch.md

## The Office Hours Booking System
<img src='https://i.imgur.com/N1AJuuV.png' width='500px'>

## API Service
* Exposes various endpoints to perform back-end operations
* Supports operations for instructors and students to interface with the booking system
* Provides a simple authentication endpoint that accepts user credentials and returns a session token
* All privileged data will require a session token
The API service will be built using Flask. Flask is well-documented and lightweight, which will keep the overhead low. We will also consider requiring an API key with each request to identify the client application. This will be separate from the authentication implementation.

## Web Client Application & Service

Users will interact with the booking system using a web client built with React.js and served by a Node.js/Express.js server-side application. The application will provide separate interfaces for instructors and students. A point of consideration that requires further discussion is whether to make API calls directly from the client, or have them go through the Node server first. If we choose to include client API keys in our implementation, the keys will need to be hidden from the browser.


## Database Service
MongoDB will be used as a data store. It will be worth considering a managed service for the live test environment, and it can be run locally in a Docker container for local development environments.


## Rationale for Technology Stack Choices
MongoDB, React, and aiohttp were chosing specifically to suit learning goals of our team members. Node.js was chosen for its ease of use and quick set-up with React. Our collecive familiarity with Javascript and Python reduces the learning overhead for diving into technologies based on these languages. MongoDB is also particularly well suited to a small-data, short-term, rapid-prototyping development process.

The modularity of our services -- keeping the API and client services separate -- allows us to develop and test our front-end and back-end applications as separate entities, against an API contract. This will also conform well to the Bezos Dictum, as the API service will be independently accessible, decoupled from the client.
