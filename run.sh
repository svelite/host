#!/bin/bash

# Check if directory argument is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

# Store arguments in variables
directory=$1

# Change directory to the specified directory
cd "$directory" || { echo "Error: Directory $directory does not exist" >&2; exit 1; }

# Run npm install
echo "Running npm install in $directory ..."
npm install

# # Change directory to build
# cd build || { echo "Error: Build directory does not exist" >&2; exit 1; }

# Start the application using pm2
echo "Starting the application with pm2 ..."

pm2 restart index.js # --name "$appname"