#!/bin/bash

# Image Recommendation System - Deployment Script
# This script helps deploy the application to Vercel

echo "🚀 Starting deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build frontend
echo "📦 Building frontend..."
pnpm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed. Please check the errors above."
    exit 1
fi

echo "✅ Frontend build successful!"

# Deploy frontend
echo "🌐 Deploying frontend to Vercel..."
echo "Please follow the prompts to configure your deployment."
echo "When asked about the framework, select 'Vite'"
echo "When asked about the output directory, select 'dist'"
echo ""
echo "Press Enter to continue..."
read

vercel --prod

echo ""
echo "🎉 Frontend deployment complete!"
echo ""
echo "Next steps:"
echo "1. Note down your frontend URL"
echo "2. Deploy the backend (see deploy.md for instructions)"
echo "3. Update your frontend environment variables with the backend URL"
echo "4. Test the complete application"
echo ""
echo "For backend deployment, run:"
echo "cd api && vercel --prod"