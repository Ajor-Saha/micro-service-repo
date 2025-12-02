#!/bin/bash

set -e

echo "🧪 Testing Kubernetes Deployment..."

# Check if all pods are running
echo ""
echo "📊 Checking pod status..."
kubectl get pods -n university

echo ""
echo "📡 Testing API Gateway via port-forward..."

# Kill any existing port-forward processes
pkill -f "port-forward.*api-gateway" 2>/dev/null || true
sleep 2

# Start port-forward in background
kubectl port-forward -n university svc/api-gateway 8888:8000 > /tmp/port-forward.log 2>&1 &
PF_PID=$!
echo "Port-forward started with PID: $PF_PID"

# Wait for port-forward to be ready
sleep 5

echo ""
echo "🔍 Testing endpoints..."
echo ""

# Test students endpoint
echo "Testing GET /api/students..."
curl -s http://localhost:8888/api/students | jq '.' || echo "Failed"
echo ""

# Test courses endpoint
echo "Testing GET /api/courses..."
curl -s http://localhost:8888/api/courses | jq '.' || echo "Failed"
echo ""

# Test faculty endpoint (note: singular 'faculty' not 'faculties')
echo "Testing GET /api/faculty..."
curl -s http://localhost:8888/api/faculty | jq '.' || echo "Failed"
echo ""

# Test enrollments endpoint
echo "Testing GET /api/enrollments..."
curl -s http://localhost:8888/api/enrollments | jq '.' || echo "Failed"
echo ""

# Test health endpoint
echo "Testing GET /health..."
curl -s http://localhost:8888/health
echo ""

echo ""
echo "✅ Testing complete!"
echo ""
echo "To access the API Gateway, run:"
echo "  kubectl port-forward -n university svc/api-gateway 8888:8000"
echo ""
echo "Then access at: http://localhost:8888"
echo ""
echo "To stop port-forward:"
echo "  kill $PF_PID"
