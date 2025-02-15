#!/bin/sh

# Loads .env file
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found"
fi

# Checks for BASE_URL
if [ -z "$BASE_URL" ]; then
    echo "Error: BASE_URL is not set, defaulting to https://queenbee-api.login.no/v1."
    export BASE_URL=https://queenbee-api.login.no/v1
fi

# Defines file to read
INPUT_FILE="./environment.prod.ts"

# Reads content to variable while running (temporarily stores the original file in memory)
ORIGINAL_CONTENT=$(cat "$INPUT_FILE")

# Edits file
if sed --version 2>/dev/null | grep -q GNU; then
  sed -i "s|__BASE_URL_PLACEHOLDER__|$BASE_URL|g" "$INPUT_FILE"
else
  sed -i '' "s|__BASE_URL_PLACEHOLDER__|$BASE_URL|g" "$INPUT_FILE"
fi

# Starts the dev server and captures the process ID
npx ng build --configuration production &

NG_PID=$!

# Restores the original file after serving
restore_file() {
    echo "$ORIGINAL_CONTENT" > "$INPUT_FILE"
}

# Traps the script / termination signals to restore the file
trap restore_file EXIT

# Waits for the Angular server to stop
wait $NG_PID
