#!/bin/bash

# Google Calendar Clone - Setup Script
# This script helps set up both backend and frontend

echo "🚀 Google Calendar Clone - Setup Script"
echo "========================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_section() {
  echo -e "\n${BLUE}→ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Check for Node.js
print_section "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
  print_warning "Node.js not found. Please install Node.js 16+ from https://nodejs.org"
  exit 1
fi
NODE_VERSION=$(node -v)
print_success "Node.js $NODE_VERSION found"

# Check for MongoDB
print_section "Checking MongoDB..."
if command -v mongod &> /dev/null; then
  print_success "MongoDB found locally"
else
  print_warning "MongoDB not found locally. Using MongoDB Atlas? Update MONGODB_URI in backend/.env"
fi

# Setup Backend
print_section "Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
  print_success "Backend dependencies installed"
else
  print_success "Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  print_success ".env created. Update MONGODB_URI if needed"
else
  print_success ".env already exists"
fi

cd ..

# Setup Frontend
print_section "Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
  print_success "Frontend dependencies installed"
else
  print_success "Frontend dependencies already installed"
fi

if [ ! -f ".env" ]; then
  echo "Creating .env file..."
  echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
  print_success ".env created"
else
  print_success ".env already exists"
fi

cd ..

# Final instructions
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}To start the application:${NC}"
echo ""
echo "1. Start MongoDB (if using local):"
echo "   mongod"
echo ""
echo "2. In terminal 1, start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In terminal 2, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "The app will open at http://localhost:3000"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "- Root: README.md"
echo "- Backend: backend/README.md"
echo "- Frontend: frontend/README.md"
echo ""
