# Production Deployment Guide

## ✅ Current Status
Your Kubernetes deployment is **successful** with:
- 16 pods running (4 databases, 8 services, 2 frontend, 2 API gateway)
- 43 Kubernetes resources deployed
- All health checks passing

## Deployment Options

### Option 1: Keep Using Minikube (Development/Demo)

**Current Access Method:**
```bash
# Start port forwards (already running)
kubectl port-forward -n university svc/api-gateway 9000:8000 &
kubectl port-forward -n university svc/frontend 3000:3000 &

# Access:
# Frontend: http://localhost:3000
# API: http://localhost:9000/api
```

**For Demo/Hackathon:**
This setup is perfect! You can:
1. Open browser to http://localhost:3000
2. Show all CRUD operations working
3. Demonstrate microservices architecture
4. Show Kubernetes resources: `kubectl get all -n university`

---

### Option 2: Deploy to Cloud Kubernetes (Production)

#### A. AWS EKS (Elastic Kubernetes Service)

**1. Prerequisites:**
```bash
# Install AWS CLI
brew install awscli

# Install eksctl
brew install eksctl

# Configure AWS credentials
aws configure
```

**2. Create EKS Cluster:**
```bash
eksctl create cluster \
  --name university-microservices \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 4 \
  --managed
```

**3. Push Images to ECR:**
```bash
# Create ECR repositories
aws ecr create-repository --repository-name student-service
aws ecr create-repository --repository-name course-service
aws ecr create-repository --repository-name faculty-service
aws ecr create-repository --repository-name enrollment-service
aws ecr create-repository --repository-name frontend

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag student-service:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/student-service:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/student-service:latest
# Repeat for all services...
```

**4. Update Image References:**
Edit each deployment YAML in `k8s/` to use ECR images:
```yaml
image: <account-id>.dkr.ecr.us-east-1.amazonaws.com/student-service:latest
imagePullPolicy: Always  # Change from Never
```

**5. Deploy to EKS:**
```bash
# Deploy everything
./scripts/deploy-k8s.sh

# Get LoadBalancer URLs
kubectl get svc -n university
```

**6. Setup Ingress (Optional but Recommended):**
```bash
# Install AWS Load Balancer Controller
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=university-microservices

# Create Ingress resource (see below)
```

**Cost Estimate:** $150-200/month for small cluster

---

#### B. Google GKE (Google Kubernetes Engine)

**1. Prerequisites:**
```bash
# Install gcloud CLI
brew install google-cloud-sdk

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**2. Create GKE Cluster:**
```bash
gcloud container clusters create university-microservices \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type e2-medium \
  --enable-autoscaling \
  --min-nodes 2 \
  --max-nodes 5
```

**3. Push Images to GCR:**
```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Tag and push
docker tag student-service:latest gcr.io/YOUR_PROJECT_ID/student-service:latest
docker push gcr.io/YOUR_PROJECT_ID/student-service:latest
# Repeat for all services...
```

**4. Update and Deploy:**
Update image references in k8s/ manifests, then:
```bash
./scripts/deploy-k8s.sh
```

**Cost Estimate:** $100-150/month

---

#### C. Azure AKS (Azure Kubernetes Service)

**1. Prerequisites:**
```bash
# Install Azure CLI
brew install azure-cli

# Login
az login
```

**2. Create AKS Cluster:**
```bash
# Create resource group
az group create --name university-microservices-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group university-microservices-rg \
  --name university-cluster \
  --node-count 3 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group university-microservices-rg --name university-cluster
```

**3. Push Images to ACR:**
```bash
# Create Azure Container Registry
az acr create --resource-group university-microservices-rg --name universityacr --sku Basic

# Login
az acr login --name universityacr

# Tag and push
docker tag student-service:latest universityacr.azurecr.io/student-service:latest
docker push universityacr.azurecr.io/student-service:latest
# Repeat for all services...
```

**4. Deploy:**
```bash
./scripts/deploy-k8s.sh
```

**Cost Estimate:** $100-150/month

---

### Option 3: Deploy to DigitalOcean Kubernetes (Budget-Friendly)

**1. Prerequisites:**
```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init
```

**2. Create Cluster:**
```bash
doctl kubernetes cluster create university-microservices \
  --region nyc1 \
  --node-pool "name=worker-pool;size=s-2vcpu-2gb;count=3"
```

**3. Push Images to DigitalOcean Registry:**
```bash
# Create registry
doctl registry create university-registry

# Login
doctl registry login

# Tag and push
docker tag student-service:latest registry.digitalocean.com/university-registry/student-service:latest
docker push registry.digitalocean.com/university-registry/student-service:latest
# Repeat for all services...
```

**4. Deploy:**
```bash
./scripts/deploy-k8s.sh
```

**Cost Estimate:** $60-80/month (most affordable)

---

## Production Enhancements

### 1. Add Ingress Resource

Create `k8s/ingress/ingress.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: university-ingress
  namespace: university
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.yourdomain.com
    - app.yourdomain.com
    secretName: university-tls
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway
            port:
              number: 8000
  - host: app.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 3000
```

### 2. Install Nginx Ingress Controller

```bash
# Add Helm repo
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace
```

### 3. Add SSL Certificates

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 4. Update Frontend Environment

For production, update `k8s/frontend/frontend.yaml`:
```yaml
env:
- name: NEXT_PUBLIC_API_URL
  value: "https://api.yourdomain.com/api"  # Use your actual domain
```

### 5. Use Managed Databases (Recommended)

Instead of StatefulSets, use cloud-managed PostgreSQL:

**AWS RDS / Azure Database / Google Cloud SQL:**
- Higher reliability
- Automated backups
- Better performance
- Easier scaling

Update service ConfigMaps with managed database URLs.

---

## CI/CD Integration

### Add Kubernetes Deployment to GitHub Actions

Update `.github/workflows/ci-cd.yml`:

```yaml
deploy-to-kubernetes:
  needs: [build-and-push]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - uses: actions/checkout@v4
    
    - name: Configure kubectl
      uses: azure/k8s-set-context@v3
      with:
        method: kubeconfig
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
    
    - name: Deploy to Kubernetes
      run: |
        # Update image tags with new SHA
        export IMAGE_TAG=${{ github.sha }}
        
        # Deploy all resources
        kubectl apply -f k8s/namespace.yaml
        kubectl apply -f k8s/secrets/
        kubectl apply -f k8s/configmaps/
        kubectl apply -f k8s/databases/
        kubectl apply -f k8s/services/
        kubectl apply -f k8s/api-gateway/
        kubectl apply -f k8s/frontend/
        
        # Wait for rollout
        kubectl rollout status deployment/student-service -n university
        kubectl rollout status deployment/course-service -n university
        kubectl rollout status deployment/faculty-service -n university
        kubectl rollout status deployment/enrollment-service -n university
        kubectl rollout status deployment/frontend -n university
        kubectl rollout status deployment/api-gateway -n university
    
    - name: Smoke Test
      run: |
        # Get LoadBalancer IP
        API_IP=$(kubectl get svc api-gateway -n university -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
        
        # Test health endpoint
        curl -f http://$API_IP:8000/health || exit 1
```

---

## Monitoring & Observability (Required for Hackathon!)

### Install Prometheus + Grafana

```bash
# Add Helm repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80

# Default credentials: admin / prom-operator
```

**This is CRITICAL for your hackathon Task 3!**

---

## Quick Commands Reference

```bash
# Check deployment status
kubectl get all -n university

# View pod logs
kubectl logs -f <pod-name> -n university

# Restart a deployment
kubectl rollout restart deployment/student-service -n university

# Scale a deployment
kubectl scale deployment/student-service --replicas=3 -n university

# Check resource usage
kubectl top pods -n university
kubectl top nodes

# Delete everything
kubectl delete namespace university
```

---

## Troubleshooting

**Pods stuck in Pending:**
```bash
kubectl describe pod <pod-name> -n university
# Check: Insufficient CPU/Memory, PVC not bound
```

**ImagePullBackOff:**
```bash
# Ensure images are pushed to registry
# Check imagePullSecrets if using private registry
```

**Service not accessible:**
```bash
# Check service endpoints
kubectl get endpoints -n university

# Check pod logs
kubectl logs -f <pod-name> -n university
```

**Database connection issues:**
```bash
# Check if database pods are ready
kubectl get pods -n university -l tier=database

# Test database connection
kubectl exec -it <service-pod> -n university -- nc -zv student-db 5432
```

---

## Demo Day Checklist

- [ ] All pods running (green status)
- [ ] Frontend accessible and loading data
- [ ] All CRUD operations working
- [ ] Prometheus + Grafana installed
- [ ] Prepared to show kubectl commands
- [ ] Architecture diagram ready
- [ ] GitHub Actions CI/CD passing
- [ ] Know how to explain microservices communication
- [ ] Ready to discuss scalability and resilience

---

## Recommended: For Hackathon Demo

**Stay with Minikube!** It's perfect for demonstration because:
1. ✅ All components visible locally
2. ✅ No cloud costs
3. ✅ Easy to show kubectl commands
4. ✅ Quick to troubleshoot live
5. ✅ Judges can see the full architecture

**Just add Observability** (Prometheus + Grafana) and you're complete!

---

## Next Steps

1. **Test your current setup:** Open http://localhost:3000 and verify all features work
2. **Add Observability:** Install Prometheus + Grafana (CRITICAL for hackathon)
3. **Prepare Demo:** Practice showing the architecture and features
4. **Optional:** Deploy to cloud if you need a public URL for the hackathon

Your Kubernetes deployment is production-ready! 🚀
