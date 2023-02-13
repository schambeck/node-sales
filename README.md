# api-node-sales
[![build](https://github.com/schambeck/node-sales/actions/workflows/node.js.yml/badge.svg)](https://github.com/schambeck/node-sales/actions/workflows/node.js.yml)
[![quality gate](https://sonarcloud.io/api/project_badges/measure?project=schambeck_node-sales&metric=alert_status)](https://sonarcloud.io/summary/overall?id=schambeck_node-sales)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=schambeck_node-sales&metric=coverage)](https://sonarcloud.io/summary/overall?id=schambeck_node-sales)

## Description

ERP Sales Order CRUD.

## Tech Stack

- NodeJS
- NestJS
- TypeORM, PostgreSQL
- Swagger
- Jest, SuperTest

## Installation

```bash
$ npm install
```

## Running the app

```bash
# postgresql
$ docker-compose up

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

## Stay in touch

- Swagger UI - http://localhost:5000
- Orders API - http://localhost:5000/orders
