#!/bin/bash

# Local Integration Test Script
# Simulates the GitHub Actions integration test locally

set -e

echo "========================================"
echo "🧪 Local Integration Test"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker compose down -v 2>/dev/null || true
echo ""

# Start services
echo "🚀 Starting all services..."
docker compose up -d

# Wait for databases
echo ""
echo "⏳ Waiting for databases to be healthy..."
for i in {1..12}; do
  if docker compose ps | grep -q "student-db.*healthy" && \
     docker compose ps | grep -q "course-db.*healthy" && \
     docker compose ps | grep -q "faculty-db.*healthy" && \
     docker compose ps | grep -q "enrollment-db.*healthy"; then
    echo -e "${GREEN}✅ All databases are healthy${NC}"
    break
  fi
  echo "Waiting for databases... ($i/12)"
  sleep 5
done

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check container status
echo ""
echo "========================================"
echo "📊 Container Status"
echo "========================================"
docker compose ps
echo ""

# Show logs
echo "========================================"
echo "📋 Recent Logs"
echo "========================================"
echo ""
echo "--- Student DB ---"
docker compose logs student-db --tail 10
echo ""
echo "--- Student Service ---"
docker compose logs student-service --tail 20
echo ""
echo "--- Course Service ---"
docker compose logs course-service --tail 10
echo ""

# Test API Gateway health
echo "========================================"
echo "🔍 Testing API Gateway"
echo "========================================"
if curl -f http://localhost:8000/health 2>/dev/null; then
  echo -e "${GREEN}✅ API Gateway is healthy${NC}"
else
  echo -e "${RED}❌ API Gateway health check failed${NC}"
  docker compose logs api-gateway --tail 20
  exit 1
fi
echo ""

# Test Student Service
echo "========================================"
echo "🔍 Testing Student Service"
echo "========================================"
response=$(curl -s -w "\n%{http_code}" http://localhost:8000/api/students)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "HTTP Status: $http_code"
echo "Response: $body"

if [ "$http_code" != "200" ]; then
  echo -e "${RED}❌ Student Service failed${NC}"
  echo ""
  echo "Direct service test:"
  curl -v http://localhost:3001/health || true
  echo ""
  echo "Full student service logs:"
  docker compose logs student-service
  docker compose down -v
  exit 1
fi
echo -e "${GREEN}✅ Student Service is working${NC}"
echo ""

# Test Course Service
echo "========================================"
echo "🔍 Testing Course Service"
echo "========================================"
if curl -f http://localhost:8000/api/courses 2>/dev/null; then
  echo -e "${GREEN}✅ Course Service is working${NC}"
else
  echo -e "${RED}❌ Course Service test failed${NC}"
  docker compose logs course-service --tail 30
  docker compose down -v
  exit 1
fi
echo ""

# Test Faculty Service
echo "========================================"
echo "🔍 Testing Faculty Service"
echo "========================================"
if curl -f http://localhost:8000/api/faculty 2>/dev/null; then
  echo -e "${GREEN}✅ Faculty Service is working${NC}"
else
  echo -e "${RED}❌ Faculty Service test failed${NC}"
  docker compose logs faculty-service --tail 30
  docker compose down -v
  exit 1
fi
echo ""

# Test Enrollment Service
echo "========================================"
echo "🔍 Testing Enrollment Service"
echo "========================================"
if curl -f http://localhost:8000/api/enrollments 2>/dev/null; then
  echo -e "${GREEN}✅ Enrollment Service is working${NC}"
else
  echo -e "${RED}❌ Enrollment Service test failed${NC}"
  docker compose logs enrollment-service --tail 30
  docker compose down -v
  exit 1
fi
echo ""

# Test Frontend
echo "========================================"
echo "🔍 Testing Frontend"
echo "========================================"
if curl -f http://localhost:3000 2>/dev/null >/dev/null; then
  echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
  echo -e "${YELLOW}⚠️  Frontend test failed (non-critical)${NC}"
fi
echo ""

# Success
echo "========================================"
echo -e "${GREEN}🎉 All Integration Tests Passed!${NC}"
echo "========================================"
echo ""
echo "Services are still running. To stop them:"
echo "  docker compose down -v"
echo ""
echo "To view logs:"
echo "  docker compose logs -f [service-name]"
echo ""
