# Test.md

## Methodology
We intend to take a bottom-up approach to testing each service individually and together. This is an integration testing approach where the lowest level components are tested first, which then facilitate the testing of higher level components. The process is repeated until the component at the top of the hierarchy is tested.

## Unit Testing
### API Service
Python's built in [unittest](https://docs.python.org/3/library/unittest.html) framework will be used for AIOHTTP.
### Webapp Service
[Jest](https://jestjs.io/) is a zero-configuration testing platform that is used by Facebook to test all JavaScript code including React applications. We have decided to use Jest because we will be working mainly with React and NodeJS in the webapp service, thus Jest would be a perfect hassle free choice for server-side testing. React TestUtils and Enzyme will be used for client-side testing (React).

## Integration Testing
### Pact
#### Web app
https://github.com/paucls/pact-consumer-contract-react-example
An example of a Pact consumer contract test for the communication between a React application and a backend API.
#### API service
https://github.com/pact-foundation/pact-python
Python version of Pact. Enables consumer driven contract testing, providing a mock service and DSL for the consumer project, and interaction playback and verification for the service provider project. Currently supports version 2 of the Pact specification.

For more information about what Pact is, and how it can help you test your code more efficiently, check out the [Pact documentation](https://docs.pact.io/).

## Functional Testing
Functional testing will be done with the same tools as integration testing. UI interactions should be translated to event invocations. Avoid things like mouse coordinates or element positions as the UI may change drastically.

## Continuous Integration
[Travis](https://travis-ci.org/) will be used to run tests automatically on all commits and pull requests.
