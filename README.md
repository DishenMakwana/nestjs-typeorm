# Nest Typeorm

## Getting started

```bash
yarn install
yarn run prepare
yarn run build
cp .env.dev .env
```

Changes in .env file according the project and change in prisma.schema file according to the usage

_Note: One can delete the migration for the first time, if there is change in the schema of user._

### Migration

```bash
yarn run migration:run
```

#### If prompt to enter migration name give appropriate name

```bash
yarn run seed:run
```

### Server

```bash
Development - yarn run start:dev
Production - yarn run start:prod
Staging - yarn run start or yarn start
```

### API Docs / Swagger

Go to: {base-url}/api/docs
Enter below credentials:

```bash
username: admin
password: Admin@123
```

#### Generate only migration file for changes in schema

```bash
yarn run migration:generate src/database/migrations/new_migration
```

#### Share Live API

```bash
npx localtunnel --port 5001 --subdomain=nest-typeorm-api
```

#### Run debugger

- add .vscode/launch.json file

```bash
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach",
      "port": 9229,
      "type": "node",
      "request": "attach",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### Generate project documentation

```bash
npx @compodoc/compodoc -p tsconfig.json -s
```
