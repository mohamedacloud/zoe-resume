#!/bin/bash

# ============================================
# Zoe Resume Builder - One-Click Setup Script
# ============================================

set -e  # Exit on error

echo "🚀 Welcome to Zoe Resume Builder Setup!"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required commands exist
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        echo "   Please install it first: $2"
        exit 1
    else
        echo -e "${GREEN}✅ $1 is installed${NC}"
    fi
}

echo "Checking prerequisites..."
echo ""

check_command "node" "https://nodejs.org/"
check_command "pnpm" "npm install -g pnpm"
check_command "docker" "https://www.docker.com/products/docker-desktop/"

echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

echo ""
echo -e "${BLUE}📄 Setting up environment file...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
docker compose up -d

echo ""
echo -e "${BLUE}⏳ Waiting for services to start (10 seconds)...${NC}"
sleep 10

echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo "To start the app, run:"
echo -e "${BLUE}  pnpm dev${NC}"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "📚 For more info, see SETUP.md"
echo ""
