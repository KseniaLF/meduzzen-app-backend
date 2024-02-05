## About the project

### This application has these features:

- Secure authorization/authentication using `JWT` tokens
- Company formation possibility to invite/accept a person to your company
- Possibility to submit/reject a request to join a company
- There are `@Roles` in companies. Participants have more opportunities and power in the company if they have the role of administrator.
- You can create `quizzes`, go through them, monitor the rankings

### Technologies used:

- `Nest.js` and `TypeScript`
- JWt tokens to identify an authenticated user
- `PostgreSQL` database and `TypeORM` migrations
- `Redis` for caching

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

## Migrations

Once you setup connection options you can create a new migration using CLI:

```bash
$ npm run migration:create
```

To automatically generate migration files with the changes made to the schema, use the following command:

```bash
$ npm run migration:generate
```

Use this command to run the migration:

```bash
$ npm run migration:run
```

If for some reason you want to revert the changes, you can run:

```bash
$ npm run migration:revert
```

The migrations will be saved in the folder `src/migrations`

---

## Redis

### Install Redis and WSL

```bash
wsl --install

curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis

sudo service redis-server start

redis-cli
ping
```

### Redis cli

```bash

# Start the Redis server:
$ sudo service redis-server start


# Stop the Redis server:
$ sudo service redis-server stop
```

```bash
# Open the redis cli:
$ redis-cli

# Get all KEYS:
$ KEYS *

# Delete all keys:
$ FLUSHDB

# Delete specific keys:
$ DEL "health_check"

# Get TTL (Time To Live)
$ TTL health_check
```

### Links

[Medium: the article that helped me connect to Redis](https://medium.com/@mut1aq/using-redis-in-nestjs-8ca1a009670f)

### Notes

❌ There are not exists `max`imum number of items in cache.
And not work decorator `@CacheTTL(..)` ❌
