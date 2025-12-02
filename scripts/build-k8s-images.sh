#!/bin/bash

set -e

echo "🐳 Building Docker images in minikube..."

# Configure shell to use minikube's Docker daemon
eval $(minikube docker-env)

echo ""
echo "📦 Building service images..."
docker build -t student-service:latest -f services/student-service/Dockerfile .
docker build -t course-service:latest -f services/course-service/Dockerfile .
docker build -t faculty-service:latest -f services/faculty-service/Dockerfile .
docker build -t enrollment-service:latest -f services/enrollment-service/Dockerfile .
docker build -t frontend:latest -f frontend/Dockerfile .

echo ""
echo "✅ Images built successfully in minikube!"
echo ""
echo "Images available:"
docker images | grep -E "student-service|course-service|faculty-service|enrollment-service|frontend"
