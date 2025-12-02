# Kubernetes Deployment Guide

## ✅ Deployment Status

Your University microservices application is **successfully deployed** to Kubernetes (minikube)!

### 🎯 Deployed Components

- ✅ **4 PostgreSQL Databases** (StatefulSets with persistent storage)
  - student-db
  - course-db
  - faculty-db
  - enrollment-db

- ✅ **4 Microservices** (2 replicas each with auto-scaling capability)
  - student-service (port 3001)
  - course-service (port 3002)
  - faculty-service (port 3003)
  - enrollment-service (port 3004)

- ✅ **Frontend** (Next.js app, 2 replicas)
  - Port 3000

- ✅ **API Gateway** (Nginx with CORS, rate limiting, security headers)
  - Port 8000 (LoadBalancer)

## 🚀 Quick Start

### Build Images
```bash
./scripts/build-k8s-images.sh
```

### Deploy to Kubernetes
```bash
./scripts/deploy-k8s.sh
```

### Test Deployment
```bash
./scripts/test-k8s.sh
```

## 🔧 Access the Application

### Option 1: Port Forward (Recommended for Development)
```bash
# API Gateway
kubectl port-forward -n university svc/api-gateway 8888:8000

# Then access at: http://localhost:8888
```

### Option 2: Minikube Tunnel (For LoadBalancer)
```bash
minikube tunnel
# Access at: http://127.0.0.1:8000
```

## 📡 API Endpoints

All endpoints are accessible through the API Gateway at port 8000:

### Students Service
- `GET /api/students` - List all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Courses Service
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Faculty Service
- `GET /api/faculty` - List all faculty (singular!)
- `GET /api/faculty/:id` - Get faculty by ID
- `POST /api/faculty` - Create faculty
- `PUT /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Delete faculty

### Enrollments Service
- `GET /api/enrollments` - List all enrollments
- `GET /api/enrollments/:id` - Get enrollment by ID
- `POST /api/enrollments` - Create enrollment
- `PUT /api/enrollments/:id` - Update enrollment
- `DELETE /api/enrollments/:id` - Delete enrollment

### Health Check
- `GET /health` - API Gateway health

## 📊 Monitoring Commands

### View all resources
```bash
kubectl get all -n university
```

### View pod status
```bash
kubectl get pods -n university
```

### View service endpoints
```bash
kubectl get svc -n university
```

### View logs
```bash
# API Gateway
kubectl logs -n university deployment/api-gateway -f

# Specific service
kubectl logs -n university deployment/student-service -f

# All pods with a label
kubectl logs -n university -l app=student-service --all-containers=true -f
```

### Describe resources
```bash
kubectl describe pod <pod-name> -n university
kubectl describe svc api-gateway -n university
```

### Execute commands in pods
```bash
kubectl exec -it -n university deployment/student-service -- sh
```

## 🔄 Update Deployment

### After code changes
```bash
# 1. Rebuild images
./scripts/build-k8s-images.sh

# 2. Restart deployments
kubectl rollout restart deployment/student-service -n university
kubectl rollout restart deployment/course-service -n university
kubectl rollout restart deployment/faculty-service -n university
kubectl rollout restart deployment/enrollment-service -n university
kubectl rollout restart deployment/frontend -n university

# 3. Check rollout status
kubectl rollout status deployment/student-service -n university
```

### Apply manifest changes
```bash
kubectl apply -f k8s/
```

## 🧹 Cleanup

### Delete the entire deployment
```bash
kubectl delete namespace university
```

### Stop minikube
```bash
minikube stop
```

### Delete minikube cluster
```bash
minikube delete
```

## 🎓 Kubernetes Features Demonstrated

### For Hackathon Judges:

1. **Production-Ready Architecture**
   - Multi-tier application with databases and microservices
   - API Gateway pattern with Nginx
   - Frontend and backend separation

2. **High Availability**
   - 2 replicas for each service
   - StatefulSets for databases with persistent volumes
   - LoadBalancer for external access

3. **Configuration Management**
   - Secrets for sensitive data (database credentials)
   - ConfigMaps for environment variables
   - Proper separation of concerns

4. **Health Checks & Self-Healing**
   - Liveness probes (restart unhealthy containers)
   - Readiness probes (route traffic only when ready)
   - Automatic pod rescheduling on failure

5. **Resource Management**
   - CPU and memory requests/limits
   - Prevents resource starvation
   - Enables efficient cluster utilization

6. **Networking**
   - Service discovery via DNS (student-service:3001)
   - Network isolation with ClusterIP
   - Rate limiting in API Gateway

7. **Security Best Practices**
   - Non-root containers
   - Secrets management
   - Security headers in API Gateway
   - Network policies (can be added)

## 📈 Next Steps (For Bonus Points)

1. **Horizontal Pod Autoscaler (HPA)**
   ```bash
   kubectl autoscale deployment student-service -n university --cpu-percent=70 --min=2 --max=10
   ```

2. **Ingress Controller**
   - Replace LoadBalancer with Ingress
   - Add TLS/SSL certificates
   - Domain-based routing

3. **Monitoring Stack**
   - Prometheus for metrics
   - Grafana for dashboards
   - Alerting rules

4. **Logging Stack**
   - Loki for log aggregation
   - Centralized logging

5. **CI/CD Integration**
   - Add kubectl commands to GitHub Actions
   - Automated deployments on push

## 🐛 Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n university
kubectl logs <pod-name> -n university
```

### ImagePullBackOff error
- Make sure images are built in minikube's Docker: `eval $(minikube docker-env)`
- Verify imagePullPolicy is set to `Never` for local images

### Service not accessible
- Check service exists: `kubectl get svc -n university`
- Check endpoints: `kubectl get endpoints -n university`
- Use port-forward for testing: `kubectl port-forward -n university svc/api-gateway 8888:8000`

### Database connection errors
- Check database pods are running: `kubectl get pods -n university -l app=student-db`
- Check ConfigMap has correct DATABASE_URL: `kubectl get configmap -n university student-service-config -o yaml`

## 📚 Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
