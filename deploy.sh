#!/bin/bash

# Deployment script for gamified couples app
# This script builds the project and prepares it for deployment

echo "🚀 Starting deployment process..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. No dist directory found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Files are ready in the 'dist' directory"
echo ""
echo "🌐 Deployment options:"
echo "1. Vercel: Run 'npx vercel' in project directory"
echo "2. Netlify: Drag & drop 'dist' folder to https://app.netlify.com/drop"
echo "3. GitHub Pages: Push to GitHub and enable Pages in repository settings"
echo "4. Docker: Run 'docker build -t couples-app . && docker run -p 3000:80 couples-app'"
echo ""
echo "🎉 Ready to deploy!"