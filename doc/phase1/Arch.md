# Arch.md

## The Office Hours Booking System
<img src='https://i.imgur.com/N1AJuuV.png' width='500px'>

## API Service
* Exposes various endpoints to perform back-end operations
* Supports operations for instructors and students to interface with the booking system
* Provides a simple authentication endpoint that accepts user credentials and returns a session token
* All privileged data will require a session token
The API service will be built using Flask. Flask is well-documented and lightweight, which will keep the overhead low. We will also consider requiring an API key with each request to authenticate the client application. This will be separate from any implementation of identity authorization (username/password).

## Web Client Application & Service

Users will interact with the booking system using a web client built with React.js and served by a Node.js/Express.js server-side application. The application will provide separate interfaces for instructors and students.

A point of consideration that requires further discussion is whether to make API calls directly from the client, or have them go through the Node server first. If we choose to include key-based client authentication in our implementation, the private key will need to be hidden from the browser. This will not prevent a man-in-the-middle attack between the client and the node server, but it will protect the API.

Another possible solution to this is for the client to ask the Node server to generate a checksum for a request it wants to send to the API, allowing the client to send the request itself without revealing the secret. We will discuss this further when the core of the application has been developed.


## Database Service
MongoDB will be used as a data store. It will be worth considering a managed service for the live (deployed) environment, and it can be run in a Docker container for local development environments.


## Rationale for Technology Stack Choices
MongoDB and React were chosing specifically to suit learning goals of our team members. Node.js was chosen for its ease of use and quick set-up with React. Python/Flask was chosen for its readability and ease of development for a RESTful API. Our collecive familiarity with Javascript and Python reduces the learning overhead for diving into technologies based on these languages. MongoDB is also particularly well suited to a small-data, short-term, rapid-prototyping development process.

The modularity of our services -- keeping the API and client services separate -- allows us to develop and test our front-end and back-end applications as separate entities, against an API contract. This will also conform well to the Bezos Dictum, as the API service will be independently accessible, decoupled from the client.
