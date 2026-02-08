#!/bin/bash

echo "Installing Resume Analyzer dependencies..."

# Install core dependencies
npm install pdf-parse multer @nestjs/platform-express @nestjs/config

# Install optional PDF processing tools
echo "Installing optional PDF processing tools..."
npm install poppler-utils

# Create temp directory
mkdir -p temp

echo "Dependencies installed successfully!"
echo "To start the server: npm run start:dev"
