#!/bin/bash

# Script to deploy with existing SQLite data

echo "📦 Deploying app to Fly.io with existing database..."

# 1. Deploy the app first
echo "1️⃣ Deploying app..."
~/.fly/bin/flyctl deploy

# 2. Wait for app to be ready
echo "2️⃣ Waiting for app to be ready..."
sleep 10

# 3. Upload your local database
echo "3️⃣ Uploading local database..."
~/.fly/bin/flyctl ssh sftp shell << EOF
put data/local.db /app/data/local.db
exit
EOF

# 4. Restart the app to use the new database
echo "4️⃣ Restarting app..."
~/.fly/bin/flyctl apps restart drp-project-management

echo "✅ Done! Your app is deployed with your existing data."
echo "🌐 Visit: https://drp-project-management.fly.dev"
