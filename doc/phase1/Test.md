# Test.md

## Goal
Describe the approach you intend to take for testing your implementation.

## Framework
### Continuous Integration
Travis will be used to run tests automatically on commits and pushes to the dev branches per service and to master.
### API Service
TODO: 
### Webapp Service
[Jest](https://jestjs.io/) is a zero configuration testing platform, that is used by Facebook to test all JavaScript code including React applications. One of Jest's philosophies is to provide an integrated "zero-configuration" experience. We observed that when engineers are provided with ready-to-use tools, they end up writing more tests, which in turn results in more stable and healthy code bases.

We have decided to use the testing framework Jest because we will be working mainly with React and NodeJS in the frontend Webapp service, thus Jest would be a perfect hassle free choice for our developmental needs.

### User Interface
React component testing will be done with Jest and Enzyme, which should cover basic forms and interactions. If needed, Puppeteer can be used to simulate mouse inputs in a chromium browser for more complex behaviour like drag and drop.

## Test Driven Development
Tests and features will be written by the same person at the same time, following TDD principles. Tests will then be reviewed during a pull request by two other people.

## Handout

Modern programmers write tests as they write code. Part of writing pretty well any code is to figure out a way to exercise it from a test suite. Typically the approach is called Test Driven Development (TDD). All of you have been exposed to Junit in Java. In this project the test code may be more challenging in that in addition to unit tests to exercise your endpoints and models you will need to find ways to test the client code for your web apps. Fortunately, modern frameworks like django and ruby on rails have full support for built in tests, often employing frameworks like http://www.seleniumhq.org/ for client testing. In fact, many books have been written that walk you through test driven development using the big web frameworks. For instance, for django see http://www.obeythetestinggoat.com/pages/book.html or for ruby see http://www.saasbook.info/

At least one of your group will probably become an expert on how to operate the testing functionality of the framework you choose.

Furthermore, once you have unit tests, you can set up a continuous integration (CI) server to test all code pushed to your repo. Our classroom github organization is authorized to send events to travis in order to run all your tests for each commit. (This is the CI infrastructure that we set up for your individual assignments in CSC301.)

Test.md will describe your plans with regards to TDD and CI. One team member will likely need to study up on how to use your framework to write tests and how to set your project up such that your tests will work in a CI framework.
