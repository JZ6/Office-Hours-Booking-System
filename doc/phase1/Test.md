# Test.md

## Goal
The approach we intend to take for testing your implementation is Bottom-up testing. This is an integration testing approach where the lowest level components are tested first, which facilitate the testing of higher level components. The process is repeated until the component at the top of the hierarchy is tested.

## Unit Testing
### API Service
Python's built in unittest framework will be used for AIOHTTP.
### Webapp Service
[Jest](https://jestjs.io/) is a zero configuration testing platform, that is used by Facebook to test all JavaScript code including React applications. One of Jest's philosophies is to provide an integrated "zero-configuration" experience. We observed that when engineers are provided with ready-to-use tools, they end up writing more tests, which in turn results in more stable and healthy code bases.

We have decided to use the testing framework Jest because we will be working mainly with React and NodeJS in the frontend Webapp service, thus Jest would be a perfect hassle free choice for our developmental needs.

## Functional/End to End Testing
Puppeteer or Selenium can be used to simulate user inputs in a browser for functional testing.

## Integration Testing
[Enzyme](https://airbnb.io/projects/enzyme/) will supplement Jest and the React TestUtils, allowing more intricate traversal of the React component tree. It allows you to take a React component, render it in memory and inspect the output with a jQuery-like API. 
Enzyme can also be ran in node using jsdom to simulate a browser.

## Continuous Integration
[Travis](https://travis-ci.org/) will be used to run tests automatically on commits and pushes to the dev branches per service and to master.

## Conclusion
We will test bottom up, with unittests in the python API service, Jest for the frontend NodeJS service, and enzyme for integration testing.
