@echo off
echo Installing dependencies with legacy-peer-deps...
cd /d C:\Users\USER\Desktop\banking-app
npm install --legacy-peer-deps

echo Building the Next.js application...
npm run build

echo Starting the development server...
set NODE_OPTIONS=--no-experimental-fetch
npm run dev
