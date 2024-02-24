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

echo "Stopping the application with pm2 ..."

pm2 stop index.js

# sudo certbot --nginx -d $name.cms.hadiahmadi.dev
