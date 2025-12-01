#!/bin/bash

echo "========================================="
echo "🔍 CI/CD Pipeline Validation"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SUCCESS=0
FAILURE=0

# Function to check if a file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}❌ $1 missing${NC}"
        ((FAILURE++))
    fi
}

# Function to check if a directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}❌ $1 missing${NC}"
        ((FAILURE++))
    fi
}

# Function to run a command and check if it succeeds
check_command() {
    if eval "$1" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $2${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((FAILURE++))
    fi
}

echo -e "${BLUE}1. Checking CI/CD Files...${NC}"
echo "-----------------------------------"
check_file ".github/workflows/ci-cd.yml"
check_file "Dockerfile.nginx"
check_file "docker-compose.yml"
check_file "test-api.sh"
echo ""

echo -e "${BLUE}2. Checking Service Structure...${NC}"
echo "-----------------------------------"
check_dir "services/student-service"
check_dir "services/course-service"
check_dir "services/faculty-service"
check_dir "services/enrollment-service"
check_dir "shared"
check_dir "frontend"
echo ""

echo -e "${BLUE}3. Checking Dockerfiles...${NC}"
echo "-----------------------------------"
check_file "services/student-service/Dockerfile"
check_file "services/course-service/Dockerfile"
check_file "services/faculty-service/Dockerfile"
check_file "services/enrollment-service/Dockerfile"
check_file "frontend/Dockerfile"
echo ""

echo -e "${BLUE}4. Checking Package Files...${NC}"
echo "-----------------------------------"
check_file "package.json"
check_file "shared/package.json"
check_file "services/student-service/package.json"
check_file "services/course-service/package.json"
check_file "services/faculty-service/package.json"
check_file "services/enrollment-service/package.json"
check_file "frontend/package.json"
echo ""

echo -e "${BLUE}5. Checking Git Repository...${NC}"
echo "-----------------------------------"
check_command "git rev-parse --git-dir" "Git repository initialized"
check_command "git remote -v | grep -q origin" "Git remote configured"
echo ""

echo -e "${BLUE}6. Testing Docker...${NC}"
echo "-----------------------------------"
check_command "docker --version" "Docker is installed"
check_command "docker-compose --version" "Docker Compose is installed"
echo ""

echo -e "${BLUE}7. Testing Node.js...${NC}"
echo "-----------------------------------"
check_command "node --version" "Node.js is installed"
check_command "npm --version" "npm is installed"
echo ""

echo "========================================="
echo -e "${BLUE}📊 Validation Summary${NC}"
echo "========================================="
echo -e "Total Checks: $((SUCCESS + FAILURE))"
echo -e "${GREEN}✅ Passed: $SUCCESS${NC}"
echo -e "${RED}❌ Failed: $FAILURE${NC}"
echo ""

if [ $FAILURE -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your CI/CD is ready!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Test locally: docker-compose up -d"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Watch pipeline: GitHub → Actions tab"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please fix the issues above.${NC}"
    echo ""
    exit 1
fi
