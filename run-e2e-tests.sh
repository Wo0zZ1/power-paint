#!/bin/bash
set -e

echo Running E2E tests...
docker compose -f ./docker-compose.e2e.yml --env-file ./.env.test run --name=e2e --rm --build e2e
EXIT_CODE=$?

echo Stopping services...
docker compose -f ./docker-compose.e2e.yml down -v

exit $EXIT_CODE