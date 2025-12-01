#!/bin/sh
set -e

echo "Running database migrations..."
npm run db:migrate || echo "Warning: Migration failed or already applied"

echo "Starting service..."
exec node dist/app.js
