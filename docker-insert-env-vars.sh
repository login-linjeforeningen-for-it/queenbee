#!/bin/sh

set -e

# Load local env variable if container /usr/src/app/.env file exists
if [ -f "/usr/src/app/.env" ]; then
  echo "Loading local environment variables from /usr/src/app/.env file"
  export $(grep -v '^#' /usr/src/app/.env | xargs)
fi

# Load local env variable if local .env file exists
if [ -f ".env" ]; then
  echo "Loading local environment variables from .env file"
  export $(grep -v '^#' .env | xargs)
fi

TARGET_FILE="environment.prod.ts"
PLACEHOLDER="__BASE_URL_PLACEHOLDER__"

# Replaces __BASE_URL_PLACEHOLDER__ with the actual BASE_URL
if [ -f "$TARGET_FILE" ]; then
    echo "Replacing BASE_URL placeholder in $TARGET_FILE"
    sed -i'' "s|${PLACEHOLDER}|${BASE_URL}|g" "$TARGET_FILE"
    echo "BASE_URL replacement completed."
else
    echo "$TARGET_FILE does not exist in the current directory."
fi
