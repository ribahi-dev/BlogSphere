#!/bin/bash

# Project Setup Script
# This script sets up both backend and frontend for development

set -e

echo "======================================"
echo "Blog Platform - Complete Setup"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Backend Setup
echo -e "${YELLOW}Step 1: Backend Setup${NC}"
echo ""

if [ -d "backend" ]; then
  cd backend
  
  # Check if composer.json exists
  if [ -f "composer.json" ]; then
    echo "Installing PHP dependencies..."
    composer install --no-interaction
    
    # Setup .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
      echo "Creating .env.local..."
      cp .env .env.local
      echo "⚠️  Please edit backend/.env.local with your configuration"
    fi
    
    # Run migrations
    echo "Running database migrations..."
    php bin/console doctrine:migrations:migrate --no-interaction
    
    echo -e "${GREEN}✓ Backend setup complete${NC}"
  else
    echo -e "${RED}✗ composer.json not found${NC}"
  fi
  
  cd ..
else
  echo -e "${RED}✗ backend directory not found${NC}"
fi

echo ""

# Step 2: Frontend Setup
echo -e "${YELLOW}Step 2: Frontend Setup${NC}"
echo ""

# Check if package.json exists
if [ -f "package.json" ]; then
  echo "Installing Node dependencies..."
  npm install
  
  # Setup .env.local if it doesn't exist
  if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    echo "VITE_API_URL=http://localhost:8000/api" > .env.local
    echo -e "${GREEN}✓ .env.local created${NC}"
  fi
  
  echo -e "${GREEN}✓ Frontend setup complete${NC}"
else
  echo -e "${RED}✗ package.json not found${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Backend: cd backend && symfony server:start --no-tls --port=8000"
echo "2. Frontend: npm run dev"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo ""
