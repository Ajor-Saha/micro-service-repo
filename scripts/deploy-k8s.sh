#!/bin/bash

set -e

echo "🚀 Deploying University App to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if minikube is running
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Kubernetes cluster is not accessible. Is minikube running?"
    echo "Run: minikube start"
    exit 1
fi

# Apply manifests in order
echo ""
echo "📦 Creating namespace..."
kubectl apply -f k8s/namespace.yaml

echo ""
echo "🔐 Creating secrets..."
kubectl apply -f k8s/secrets/

echo ""
echo "⚙️  Creating configmaps..."
kubectl apply -f k8s/configmaps/

echo ""
echo "🗄️  Deploying databases..."
kubectl apply -f k8s/databases/

echo ""
echo "⏳ Waiting for databases to be ready..."
kubectl wait --for=condition=ready pod -l app=student-db -n university --timeout=180s
kubectl wait --for=condition=ready pod -l app=course-db -n university --timeout=180s
kubectl wait --for=condition=ready pod -l app=faculty-db -n university --timeout=180s
kubectl wait --for=condition=ready pod -l app=enrollment-db -n university --timeout=180s

echo ""
echo "🚀 Deploying microservices..."
kubectl apply -f k8s/services/

echo ""
echo "⏳ Waiting for services to be ready..."
kubectl wait --for=condition=available deployment/student-service -n university --timeout=180s
kubectl wait --for=condition=available deployment/course-service -n university --timeout=180s
kubectl wait --for=condition=available deployment/faculty-service -n university --timeout=180s
kubectl wait --for=condition=available deployment/enrollment-service -n university --timeout=180s

echo ""
echo "🌐 Deploying API Gateway..."
kubectl apply -f k8s/api-gateway/

echo ""
echo "⏳ Waiting for API Gateway to be ready..."
kubectl wait --for=condition=available deployment/api-gateway -n university --timeout=120s

echo ""
echo "💻 Deploying Frontend..."
kubectl apply -f k8s/frontend/

echo ""
echo "⏳ Waiting for Frontend to be ready..."
kubectl wait --for=condition=available deployment/frontend -n university --timeout=120s

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Cluster Status:"
kubectl get all -n university

echo ""
echo "🌍 Access the application:"
echo "API Gateway: $(minikube service api-gateway -n university --url)"
echo ""
echo "To access from your browser:"
echo "  minikube service api-gateway -n university"
echo ""
echo "To view logs:"
echo "  kubectl logs -f deployment/student-service -n university"
echo "  kubectl logs -f deployment/api-gateway -n university"
echo ""
echo "To test the API:"
echo "  curl \$(minikube service api-gateway -n university --url)/api/students"
