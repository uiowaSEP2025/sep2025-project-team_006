# Project Commands

This document provides an explanation of all the scripts available in the various `package.json` files in this repository. 
These scripts are useful for building, testing, debugging, and running the application in different environments.

## Root Commands

in the `root` directory these are all the available commands:

```bash
# install:all - installs dependencies across the entire repository locally, good to do after each code merge
$ npm run install:all

# dev:all - runs the entire project in development mode
$ npm run dev:all

# dev:back - runs the backend in development mode from the root
$ npm run dev:back

# dev:front - runs the frontend in development mode from the root
$ npm run dev:front

# start:all - runs the entire project in normal mode
$ npm run start:all

# build:all - compiles the entire project
$ npm run build:all 
```

## Backend Commands

in the `../backend/` directory these are all the available commands:

```bash
# build - compiles the application
$ npm run build

# format - formats the code using Prettier
$ npm run format

# start - starts the application in normal mode
$ npm run start

# start:dev - starts the application in development mode with live reload
$ npm run start:dev

# start:debug - starts the application in debug mode with live reload
$ npm run start:debug

# start:prod - starts the compiled application in production mode
$ npm run start:prod

# lint - runs ESLint to check and fix code style issues
$ npm run lint

# test - runs units tests using Jest
$ npm run test

# test:watch - runs Jest tests in watch mode, will re-run tests when files change
$ npm run test:watch

# test:cov - runs tests and generates a coverage report
$ npm run test:cov

# test:debug - runs Jest tests in debug mode
$ npm run test:debug

# test:e2e - runs end-to-end tests, this helps verify system functions correctly
$ npm run test:e2e
```

## Frontend Commands

in the `../frontend/` directory these are all the available commands:

```bash
# dev - starts Next.js in development mode with Turbopack
$ npm run dev

# build - compiles the Next.js application for production
$ npm run build

# start -  runs the Next.js application in production mode
$ npm run start

# lint - runs ESLint to check and fix code style issues
$ npm run lint
```
