#!/bin/bash

# Project Verification Script
# Checks if everything is properly set up

set -e

echo "======================================"
echo "Blog Platform - Installation Check"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check PHP
echo "Checking PHP..."
if command -v php &> /dev/null; then
  PHP_VERSION=$(php -v | head -n 1)
  echo -e "${GREEN}✓ PHP installed: $PHP_VERSION${NC}"
else
  echo -e "${RED}✗ PHP not found${NC}"
  exit 1
fi

# Check Composer
echo ""
echo "Checking Composer..."
if command -v composer &> /dev/null; then
  COMPOSER_VERSION=$(composer --version)
  echo -e "${GREEN}✓ Composer installed: $COMPOSER_VERSION${NC}"
else
  echo -e "${RED}✗ Composer not found${NC}"
  exit 1
fi

# Check Node.js
echo ""
echo "Checking Node.js..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
  echo -e "${RED}✗ Node.js not found${NC}"
  exit 1
fi

# Check npm
echo ""
echo "Checking npm..."
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v)
  echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
else
  echo -e "${RED}✗ npm not found${NC}"
  exit 1
fi

# Check Backend
echo ""
echo "Checking Backend..."
if [ -d "backend" ]; then
  echo -e "${GREEN}✓ Backend directory exists${NC}"
  
  if [ -f "backend/composer.json" ]; then
    echo -e "${GREEN}✓ Backend composer.json found${NC}"
  else
    echo -e "${RED}✗ Backend composer.json not found${NC}"
  fi
  
  if [ -f "backend/.env.local" ]; then
    echo -e "${GREEN}✓ Backend .env.local exists${NC}"
  else
    echo -e "${YELLOW}⚠ Backend .env.local not found (will be created during setup)${NC}"
  fi
else
  echo -e "${RED}✗ Backend directory not found${NC}"
  exit 1
fi

# Check Frontend
echo ""
echo "Checking Frontend..."
if [ -f "package.json" ]; then
  echo -e "${GREEN}✓ Frontend package.json found${NC}"
else
  echo -e "${RED}✗ Frontend package.json not found${NC}"
  exit 1
fi

if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓ Frontend .env.local exists${NC}"
else
  echo -e "${YELLOW}⚠ Frontend .env.local not found (will be created during setup)${NC}"
fi

# Check Documentation
echo ""
echo "Checking Documentation..."
docs=(
  "README.md"
  "API_COMPLETE_DOCUMENTATION.md"
  "PROJECT_GUIDE.md"
  "QUICK_START.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo -e "${GREEN}✓ $doc exists${NC}"
  else
    echo -e "${RED}✗ $doc not found${NC}"
  fi
done

# Check Backend dependencies
echo ""
echo "Checking Backend Dependencies..."
if [ -d "backend/vendor" ]; then
  echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
  echo -e "${YELLOW}⚠ Backend dependencies not installed (run setup to install)${NC}"
fi

# Check Frontend dependencies
echo ""
echo "Checking Frontend Dependencies..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
  echo -e "${YELLOW}⚠ Frontend dependencies not installed (run setup to install)${NC}"
fi

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}✓ Installation Check Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Run setup: bash setup.sh"
echo "2. Start backend: cd backend && symfony server:start"
echo "3. Start frontend: npm run dev"
echo ""
