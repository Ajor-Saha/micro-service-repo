#!/bin/bash

# AWS EKS Deployment Script
# This script deploys the microservices application to AWS EKS

set -e

echo "🚀 AWS EKS Deployment Script"
echo "=============================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found. Install it with: brew install awscli${NC}"
        exit 1
    fi
    
    if ! command -v eksctl &> /dev/null; then
        echo -e "${RED}❌ eksctl not found. Install it with: brew install eksctl${NC}"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl not found. Install it with: brew install kubectl${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites installed${NC}"
    echo ""
}

# Configure AWS credentials
configure_aws() {
    echo "🔐 Configuring AWS credentials..."
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${YELLOW}⚠️  AWS credentials not configured${NC}"
        echo "Please configure AWS CLI with your credentials:"
        aws configure
    else
        echo -e "${GREEN}✅ AWS credentials configured${NC}"
        aws sts get-caller-identity
    fi
    echo ""
}

# Create EKS cluster
create_cluster() {
    CLUSTER_NAME=${1:-university-microservices}
    REGION=${2:-us-east-1}
    
    echo "🏗️  Creating EKS cluster: $CLUSTER_NAME in $REGION..."
    echo "This will take 15-20 minutes..."
    echo ""
    
    # Check if cluster already exists
    if eksctl get cluster --name $CLUSTER_NAME --region $REGION &> /dev/null; then
        echo -e "${YELLOW}⚠️  Cluster $CLUSTER_NAME already exists${NC}"
        read -p "Do you want to use the existing cluster? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Please delete the existing cluster or choose a different name"
            exit 1
        fi
    else
        eksctl create cluster \
            --name $CLUSTER_NAME \
            --region $REGION \
            --nodegroup-name standard-workers \
            --node-type t3.medium \
            --nodes 3 \
            --nodes-min 2 \
            --nodes-max 4 \
            --managed
        
        echo -e "${GREEN}✅ EKS cluster created${NC}"
    fi
    
    # Update kubeconfig
    aws eks update-kubeconfig --name $CLUSTER_NAME --region $REGION
    echo -e "${GREEN}✅ kubectl configured for EKS${NC}"
    echo ""
}

# Create ECR repositories
create_ecr_repos() {
    REGION=${1:-us-east-1}
    
    echo "📦 Creating ECR repositories..."
    
    SERVICES=("student-service" "course-service" "faculty-service" "enrollment-service" "frontend")
    
    for SERVICE in "${SERVICES[@]}"; do
        echo "Creating repository: $SERVICE"
        aws ecr create-repository \
            --repository-name $SERVICE \
            --region $REGION \
            --image-scanning-configuration scanOnPush=true 2>/dev/null || echo "Repository $SERVICE already exists"
    done
    
    echo -e "${GREEN}✅ ECR repositories created${NC}"
    echo ""
}

# Build and push images to ECR
push_images() {
    REGION=${1:-us-east-1}
    
    echo "🐳 Building and pushing Docker images to ECR..."
    
    # Get AWS account ID
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
    
    # Login to ECR
    echo "Logging in to ECR..."
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URL
    
    # Build and push each service
    SERVICES=("student-service" "course-service" "faculty-service" "enrollment-service")
    
    for SERVICE in "${SERVICES[@]}"; do
        echo "Building $SERVICE..."
        docker build -f services/$SERVICE/Dockerfile -t $SERVICE:latest .
        
        echo "Tagging and pushing $SERVICE..."
        docker tag $SERVICE:latest $ECR_URL/$SERVICE:latest
        docker push $ECR_URL/$SERVICE:latest
    done
    
    # Build and push frontend
    echo "Building frontend..."
    docker build -f frontend/Dockerfile -t frontend:latest .
    docker tag frontend:latest $ECR_URL/frontend:latest
    docker push $ECR_URL/frontend:latest
    
    echo -e "${GREEN}✅ All images pushed to ECR${NC}"
    echo ""
}

# Update Kubernetes manifests with ECR image URLs
update_manifests() {
    REGION=${1:-us-east-1}
    
    echo "📝 Updating Kubernetes manifests with ECR URLs..."
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
    
    # Create temporary directory for modified manifests
    mkdir -p k8s-eks
    cp -r k8s/* k8s-eks/
    
    # Update image references in all deployment files
    find k8s-eks -name "*.yaml" -type f -exec sed -i.bak \
        -e "s|image: student-service:latest|image: $ECR_URL/student-service:latest|g" \
        -e "s|image: course-service:latest|image: $ECR_URL/course-service:latest|g" \
        -e "s|image: faculty-service:latest|image: $ECR_URL/faculty-service:latest|g" \
        -e "s|image: enrollment-service:latest|image: $ECR_URL/enrollment-service:latest|g" \
        -e "s|image: frontend:latest|image: $ECR_URL/frontend:latest|g" \
        -e "s|imagePullPolicy: Never|imagePullPolicy: Always|g" \
        {} \;
    
    # Update frontend environment variable for LoadBalancer
    sed -i.bak 's|NEXT_PUBLIC_API_URL.*|NEXT_PUBLIC_API_URL\n          value: "http://$(kubectl get svc api-gateway -n university -o jsonpath='"'"'{.status.loadBalancer.ingress[0].hostname}'"'"'):8000/api"|g' k8s-eks/frontend/frontend.yaml
    
    # Remove backup files
    find k8s-eks -name "*.bak" -delete
    
    echo -e "${GREEN}✅ Manifests updated${NC}"
    echo ""
}

# Deploy to EKS
deploy_to_eks() {
    echo "🚀 Deploying to EKS cluster..."
    
    # Use modified manifests
    MANIFEST_DIR="k8s-eks"
    
    echo "Applying namespace..."
    kubectl apply -f $MANIFEST_DIR/namespace.yaml
    
    echo "Applying secrets..."
    kubectl apply -f $MANIFEST_DIR/secrets/
    
    echo "Applying configmaps..."
    kubectl apply -f $MANIFEST_DIR/configmaps/
    
    echo "Deploying databases..."
    kubectl apply -f $MANIFEST_DIR/databases/
    echo "Waiting for databases to be ready..."
    sleep 30
    kubectl wait --for=condition=ready pod -l tier=database -n university --timeout=300s
    
    echo "Deploying services..."
    kubectl apply -f $MANIFEST_DIR/services/
    
    echo "Deploying API Gateway..."
    kubectl apply -f $MANIFEST_DIR/api-gateway/
    
    echo "Deploying frontend..."
    kubectl apply -f $MANIFEST_DIR/frontend/
    
    echo "Waiting for all deployments to be ready..."
    kubectl wait --for=condition=available deployment --all -n university --timeout=300s
    
    echo -e "${GREEN}✅ Deployment complete${NC}"
    echo ""
}

# Get LoadBalancer URLs
get_loadbalancer_urls() {
    echo "🌐 Getting LoadBalancer URLs..."
    echo "This may take a few minutes for AWS to provision the load balancers..."
    echo ""
    
    # Wait for LoadBalancers to get external IPs
    echo "Waiting for API Gateway LoadBalancer..."
    kubectl wait --for=jsonpath='{.status.loadBalancer.ingress}' service/api-gateway -n university --timeout=300s
    
    echo "Waiting for Frontend LoadBalancer..."
    kubectl wait --for=jsonpath='{.status.loadBalancer.ingress}' service/frontend -n university --timeout=300s
    
    API_URL=$(kubectl get svc api-gateway -n university -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    FRONTEND_URL=$(kubectl get svc frontend -n university -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}🎉 Deployment Successful!${NC}"
    echo "=========================================="
    echo ""
    echo "API Gateway URL: http://$API_URL:8000"
    echo "Frontend URL: http://$FRONTEND_URL:3000"
    echo ""
    echo "📝 Save these URLs to access your application"
    echo ""
    
    # Update frontend environment with actual API URL
    echo "Updating frontend with LoadBalancer URL..."
    kubectl set env deployment/frontend -n university NEXT_PUBLIC_API_URL=http://$API_URL:8000/api
    kubectl rollout restart deployment/frontend -n university
    
    echo ""
    echo "Test API health:"
    echo "curl http://$API_URL:8000/health"
    echo ""
}

# Display cluster info
show_cluster_info() {
    echo "📊 Cluster Information:"
    echo "======================"
    kubectl get nodes
    echo ""
    kubectl get all -n university
    echo ""
}

# Main deployment flow
main() {
    CLUSTER_NAME=${1:-university-microservices}
    REGION=${2:-us-east-1}
    
    echo "Deploying to AWS EKS"
    echo "Cluster Name: $CLUSTER_NAME"
    echo "Region: $REGION"
    echo ""
    
    read -p "Do you want to proceed? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 1
    fi
    
    check_prerequisites
    configure_aws
    create_cluster $CLUSTER_NAME $REGION
    create_ecr_repos $REGION
    push_images $REGION
    update_manifests $REGION
    deploy_to_eks
    get_loadbalancer_urls
    show_cluster_info
    
    echo ""
    echo -e "${GREEN}✅ EKS deployment complete!${NC}"
    echo ""
    echo "To delete the cluster later, run:"
    echo "eksctl delete cluster --name $CLUSTER_NAME --region $REGION"
}

# Run main function with arguments
main "$@"
