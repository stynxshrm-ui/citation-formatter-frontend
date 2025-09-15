#!/bin/bash

# Citation Formatter Frontend Deployment Script
# Usage: ./scripts/deploy.sh [platform] [environment]

set -e

PLATFORM=${1:-vercel}
ENVIRONMENT=${2:-production}

echo "🚀 Deploying Citation Formatter Frontend to $PLATFORM ($ENVIRONMENT)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test -- --coverage --watchAll=false

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Deploy based on platform
case $PLATFORM in
    "vercel")
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI not found. Install it with: npm i -g vercel"
            exit 1
        fi
        ;;
    "netlify")
        echo "🚀 Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=build
        else
            echo "❌ Netlify CLI not found. Install it with: npm i -g netlify-cli"
            exit 1
        fi
        ;;
    "docker")
        echo "🐳 Building Docker image..."
        docker build -t citation-formatter-frontend:latest .
        echo "✅ Docker image built successfully!"
        echo "Run with: docker run -p 3000:80 citation-formatter-frontend:latest"
        ;;
    "docker-compose")
        echo "🐳 Deploying with Docker Compose..."
        docker-compose up -d --build
        echo "✅ Deployed with Docker Compose!"
        ;;
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Available platforms: vercel, netlify, docker, docker-compose"
        exit 1
        ;;
esac

echo "✅ Deployment completed successfully!"
