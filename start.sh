#!/bin/bash

# Check if directory argument is provided
if [ $# -ne 3 ]; then
  echo "Usage: $0 <directory> <port> <name>"
  exit 1
fi

# Store arguments in variables
directory=$1
port=$2
name=$3


# Change directory to the specified directory
cd "$directory" || { echo "Error: Directory $directory does not exist" >&2; exit 1; }

npm install


echo "Starting the application with pm2 ..."

PORT=$port pm2 --update-env start index.js --name svelite-$name

sudo certbot --nginx -d $name.cms.hadiahmadi.dev
