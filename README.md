## Description

### Meduzzen app backend

## Installation

```bash
$ git clone https://github.com/KseniaLF/meduzzen-app-backend.git

$ cd meduzzen-app-backend
$ npm install
```

and copy the `.env.sample` variables into a separate `.env` file, fill them out & and that's all you need to get started!

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
# launch this application within Docker
$ docker build . -t my-app
$ docker run -p 3001:3001 my-app
```

Then go to this link [http://localhost:3001/api](http://localhost:3001/api) to see if the server is running.

```bash
# run tests within Docker
$ docker run my-app sh -c "TEST_COMMAND"
```

```bash
# run this app with docker-compose
$ docker compose up
```
