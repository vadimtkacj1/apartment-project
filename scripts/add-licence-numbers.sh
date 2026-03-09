#!/bin/bash

# Add licence numbers to team members/owners
# Run this on the server

set -e

echo "Adding licence numbers to database..."
echo ""

# Run the TypeScript script
npx tsx scripts/add-licence-numbers.ts

echo ""
echo "Restarting application..."
pm2 restart apartment-project

echo ""
echo "✓ Done! Check the website - licence numbers should now appear."
