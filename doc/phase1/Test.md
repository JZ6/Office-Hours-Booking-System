# Test.md

## Goal
Describe the approach you intend to take for testing your implementation.

## Unit Testing
### API Service
Python's built in unittest framework will be used for AIOHTTP.
### Webapp Service
[Jest](https://jestjs.io/) is a zero configuration testing platform, that is used by Facebook to test all JavaScript code including React applications. One of Jest's philosophies is to provide an integrated "zero-configuration" experience. We observed that when engineers are provided with ready-to-use tools, they end up writing more tests, which in turn results in more stable and healthy code bases. [Enzyme](https://airbnb.io/projects/enzyme/) will supplement Jest and the React TestUtils, allowing more intricate traversal of the React component tree.

We have decided to use the testing framework Jest because we will be working mainly with React and NodeJS in the frontend Webapp service, thus Jest would be a perfect hassle free choice for our developmental needs.

## Functional/End to End Testing
Puppeteer or Selenium can be used to simulate user inputs in a browser for functional testing.

## Integration Testing
TODO

## Continuous Integration
[Travis](https://travis-ci.org/) will be used to run tests automatically on commits and pushes to the dev branches per service and to master.
