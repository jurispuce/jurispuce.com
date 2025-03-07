#!/bin/bash

# This script handles deployment of the Hugo site with environment-specific baseURL

# Default to development if no environment is specified
ENVIRONMENT=${1:-development}

# Set baseURL based on environment
case $ENVIRONMENT in
  development)
    export HUGO_BASEURL="http://localhost:1313/"
    ;;
  staging)
    export HUGO_BASEURL="https://jurispuceweb.netlify.app/"
    ;;
  production)
    export HUGO_BASEURL="https://jurispuce.com/"
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    echo "Usage: ./deploy.sh [development|staging|production]"
    exit 1
    ;;
esac

echo "Deploying to $ENVIRONMENT environment with baseURL: $HUGO_BASEURL"

# Clean the public directory
rm -rf public

# Build the site with the environment-specific baseURL
hugo --minify

# Add additional deployment steps here based on your hosting provider
# For example, if using AWS S3:
# if [ "$ENVIRONMENT" == "production" ]; then
#   aws s3 sync public/ s3://your-bucket-name/ --delete
# fi

echo "Deployment completed successfully!"
