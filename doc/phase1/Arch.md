# Arch.md

## The Office Hours Booking System
<img src='https://i.imgur.com/N1AJuuV.png' width='500px'>

## Web Application Server
Serves the client either an Instructor, TA, or Student web application based on their verified identity. The server will be built using the Node.js Express web application framework.

## Client Web Application
An Instructor, TA, and Student web application that allow the client to perform office hour booking actions through the API service. The applications allow clients to request actions through the API service's endpoints. The application user interface will be built using React.

## API Service
Expose various endpoints to perform requested Instructor, TA, and Student actions. The API service will be built using aiohttp and will interface with the database service using Motor.

## Database Service
Performs queries requested by the API service using MongoDB.

## Rationale for division of system
The decision to divide the office hour booking system into Instructor/TA and Student web applications comes from the different use requirements of Instructor/TA and Student users. Instructors have the ability to create courses, specify TAs, manage intervals and notes, and add student's to the class, and since they are ultimately the course admistrators they should be the only ones able perform these administration tasks. This is different than what TAs are intended to do which is only manage intervals, meetings, and notes. This gives reason to have two separate web applications to support the disjoint needs of a course instructor and its TAs. Students only manage their own meetings and notes meaning they lack any use requirements that can affect any other users besides themselves, thus warranting a separate web application.

In addition, the division of our system into independant service components allows the independant development of an individual service that is to be first tested within the functional scope of the service. As individual service pass their local tests, system wide integration tests can be performed to verify the correctness of groups of services.

## Rationale for choice of middleware
The choice of a Node.js-React-aiohttp-MongoDB development stack comes from fulfilling individual team member learning goals about the web technologies they would like to learn and considering our collective familarity in Javascript and Python.

We recognize the benefits found during development, testing, and deployment by designing interprocess communication to be done only through exposed API endpoints of modular, independent, and blackboxed services -- as succinctly suggested in the Bezos Dictum. Hence our choice of using JSON objects to package information to send between services guided our choice of development stack as each of our chosen frameworks, libraries, and database provide integrated support for handling JSON.
