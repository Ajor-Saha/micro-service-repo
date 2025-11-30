#!/bin/bash

echo "🚀 Starting University Management System..."
echo ""

# Build and start all services
echo "📦 Building and starting all services with Docker Compose..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ All services are starting up!"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Access Points:"
echo "  Frontend:           http://localhost:3000"
echo "  Student Service:    http://localhost:3001"
echo "  Course Service:     http://localhost:3002"
echo "  Faculty Service:    http://localhost:3003"
echo "  Enrollment Service: http://localhost:3004"
echo ""
echo "📝 View logs with: docker-compose logs -f [service-name]"
echo "🛑 Stop all with: docker-compose down"
echo ""
