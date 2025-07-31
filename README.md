# Utech React Base Web Application

## Build Status

### dev: [![Build Status](https://dev.azure.com/usii/UTech/_apis/build/status/utech-react-base?branchName=dev)](https://dev.azure.com/usii/UTech/_build/latest?definitionId=397&branchName=dev)

### main: [![Build Status](https://dev.azure.com/usii/UTech/_apis/build/status/utech-react-base?branchName=main)](https://dev.azure.com/usii/UTech/_build/latest?definitionId=397&branchName=main)

## Global Dependencies

Using your systems package manager, install the following packages:

1. [NodeJS 16+](https://nodejs.org/)

## Dependencies

- Typed Language - [TypeScript](https://www.typescriptlang.org/)
- Framework - [React](https://reactjs.org/)
- Build Tool - [Vite](https://vitejs.dev/)
- Service Worker Library/Offline Support - [Workbox](https://web.dev/learn/pwa/workbox/)
- Code Formatter - [Prettier](https://prettier.io/)
- Code Style - [ESLint](https://eslint.org/)
- State Management - [Redux Toolkit](https://redux-toolkit.js.org/) & [React Context](https://reactjs.org/docs/context.html) & [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- UI Framework - [Material-UI](https://mui.com/core/)
- Unit Testing - [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- Web Standards Compliance - [Lighthouse](https://github.com/GoogleChrome/lighthouse)

## Overview

`<!-- TODO -->`

## Assumptions

`<!-- TODO -->`

## Install local dependencies

`$ npm install`

## Run locally

`$ npm start`

## Run scripts

`<!-- TODO -->`

## Router + State Management

Router via React Router and is inside `./routes` folder, set on `AppRoutes.tsx`, with the data in `routes.ts` exposed by its `index.ts`.

The app is using Redux, React Context, Hooks for state management.

## Unit Testing

Unit Testing is supported with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) that works with [Jest](https://github.com/facebook/jest).

The 'src/setupTests.ts' file is already configured to work with React Testing Library.

To run the tests:

`$ npm run test`

## Eslint configurations

Lint set using predefined rules inside the config file `.eslintrc`.

## Format configurations

[Prettier](https://prettier.io/) is set using settings inside the config file `.prettierrc`.

## Optimizing

Precache - `registerSW.js` through `vite-plugin-pwa`

## Publish

`<!-- TODO -->`
