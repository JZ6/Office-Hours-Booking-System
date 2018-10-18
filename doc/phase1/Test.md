# Test.md

## Methodology
The approach we intend to take for testing your implementation is Bottom-up testing. This is an integration testing approach where the lowest level components are tested first, which facilitate the testing of higher level components. The process is repeated until the component at the top of the hierarchy is tested. This approach applies within each service just as much as between services.

## Unit Testing
### API Service
Python's built in [unittest](https://docs.python.org/3/library/unittest.html) framework will be used for AIOHTTP.
### Webapp Service
[Jest](https://jestjs.io/) is a zero configuration testing platform, that is used by Facebook to test all JavaScript code including React applications. One of Jest's philosophies is to provide an integrated "zero-configuration" experience. We observed that when engineers are provided with ready-to-use tools, they end up writing more tests, which in turn results in more stable and healthy code bases.

We have decided to use the testing framework Jest because we will be working mainly with React and NodeJS in the Webapp service, thus Jest would be a perfect hassle free choice for our server-side developmental needs, and React TestUtils would be sufficient for client-side (React).

## Functional/End to End Testing
Puppeteer or Selenium can be used to simulate user inputs in a browser for functional testing. However, if possible, UI interactions should be translated to event invocations, which can be tested without simulations. Avoid things like mouse coordinates as the UI may change drastically.

## Integration Testing

### Pact

#### Web app
https://github.com/paucls/pact-consumer-contract-react-example
An example of a Pact consumer contract test for the communication between a React application and a backend API.

#### API service
https://github.com/pact-foundation/pact-python
Python version of Pact. Enables consumer driven contract testing, providing a mock service and DSL for the consumer project, and interaction playback and verification for the service provider project. Currently supports version 2 of the Pact specification.

For more information about what Pact is, and how it can help you test your code more efficiently, check out the Pact documentation.

## Continuous Integration
[Travis](https://travis-ci.org/) will be used to run tests automatically on all commits and pull requests.

## Conclusion
We will test bottom up, with unittests in the python API service, Jest for the Webapp NodeJS service, and enzyme for integration testing.
