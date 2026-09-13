@echo off
setlocal enabledelayedexpansion

echo Running E2E tests...
docker compose -f ./docker-compose.e2e.yml --env-file ./.env.test run --name=e2e --rm --build e2e
set EXIT_CODE=%errorlevel%

echo Stopping services...
docker compose -f ./docker-compose.e2e.yml down -v

exit /b %EXIT_CODE%