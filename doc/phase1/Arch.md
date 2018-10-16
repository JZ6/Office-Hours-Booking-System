# Arch.md

## The Office Hours Booking System
<img src='https://i.imgur.com/N1AJuuV.png' width='500px'>

## Web Application Server
Serves the client either an Instructor, TA, or Student web application based on their verified identity. The server will be built using the Node.js Express web application framework.

## Client Web Application
Either an Instructor, TA, or Student web application that allow the client to perform office hour booking actions through the API service. The applications allow clients to request actions through the API service's endpoints. The application user interface will be built using React.

## API Service
Expose various endpoints to perform requested Instructor, TA, and Student actions. The API service will be built using aiohttp and will interface with the database service using Motor.

## Database Service
Performs queries requested by the API service using MongoDB.
