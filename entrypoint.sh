#!/bin/bash
set -eu

if [[ "$RUN_MIGRATIONS" =~ [Tt]rue ]]; then
    npm run migration:run
fi

if [[ "$RUN_SEEDERS" =~ [Tt]rue ]]; then
    npm run seed:run
fi

if [[ "$RUN_MIGRATIONS_SEEDERS" =~ [Tt]rue ]]; then
    npm run migration:run &&
    npm run seed:run
fi

exec "$@"

# run server from here
node ./dist/src/main.js