# Arch.md

## Goal
Slice the app. Describe the main client and server components and identify the middleware you intend to use to build each. 

## Frameworks

### Preferences

| Name | Frontend | Backend | Database |
| --- | --- | --- | --- |
| Jay | React, Vanilla JS, Angular | Node.js, Python | SQL, MongoDB |
| Grant | React | Node.js | MongoDB |
| Benson | React, JS | Python, Java | No preference |
| Asher |  |  |  |
| Pablo |  |  |  |
| Abed | React | Node.js, Ruby, Python | MongoDB |

### Chosen

| Frontend | Backend | Database |
| --- | --- | --- |
|  |  |  |

## Design

Chosen testing framework:

TDD and CI Plans:

## Handout

A  system like the above can be sliced into webapps and services in many different ways. (Until recently, before the rise of web services, most system defaulted to  one monolithic webapp.) 

In this course we are insisting you break the system up into at least two webapps and services: a ticket webapp that creates, views, adds notes to and edits tickets and a GAPF webapp that FSS use to enter GAPF information and the budget director uses to consume it.  Furthermore, to follow the Bezos doctrine,  we insist that the webapps call into at least two web services

To slice up the system, you must, roughly speaking, study the use cases listed in the system description and decide which should be implemented by each webapp. Similarly, you have to decide which service(s) should support which use case.

You have to decide which technology you will use to implement each webapp and endpoint. For instance, a python django-rest server seems like a natural technology to use to implement an endpoint for the Applicant REST api (lots of Node.js libraries would make sense too). The client side could be as simple as simple HTML served by django, node.js, tomcat, or as complicated as a react JavaScript client. It's up to you.

You should probably base your decisions on a combination of what your team members already know and perhaps also what you would like to take the opportunity to learn. For instance, if you are all Angular/node.js experts, you might choose to use that infrastructure if you think this would make building your project easier, or, you might want to scratch an itch and learn how a React Javascript client and (python) django-rest server work together.

Note the Bezos dictum does not mean that you must write all UI in JavaScript libraries like React. Suppose you decide to build a simple HTML client served by your favourite Java infrastructure (Tomcat?). Bezos dictum would prohibit, for instance, a Tomcat server code populating an HTML template by querying the database behind the back of the web service that serves applicants. However, if the tomcat code called the official endpoint to populate its HTML template that would be fine.

You will document the APIs you design. You might consider using the OpenApi format (yaml or json) that can be displayed by swagger's online API editor. See swagger open api.  Check out http://editor.swagger.io/#/. 
