#!/bin/bash

# Perplexity AI Worker Deployment Script
# This script automates the deployment process for the Cloudflare Worker

set -e

echo "🚀 Starting Perplexity AI Worker deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "wrangler.toml" ]; then
    echo "❌ wrangler.toml not found. Please run this script from the worker directory."
    exit 1
fi

# Check if we're logged into Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged into Cloudflare. Please run: wrangler login"
    exit 1
fi

# Determine environment
ENV=${1:-production}
echo "📦 Deploying to environment: $ENV"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Deploy the worker
echo "🚀 Deploying worker..."
if [ "$ENV" = "staging" ]; then
    wrangler deploy --env staging
else
    wrangler deploy --env production
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Set your API_AUTH_TOKEN: wrangler secret put API_AUTH_TOKEN"
echo "2. Set your PERPLEXITY_API_KEY: wrangler secret put PERPLEXITY_API_KEY"
echo "3. Test the worker with a sample request"
echo ""
echo "📊 Monitor your worker at: https://dash.cloudflare.com/workers" 