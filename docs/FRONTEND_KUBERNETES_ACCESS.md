# 🌐 Frontend Access Guide - Kubernetes Deployment

## ✅ Frontend Status: RUNNING ON KUBERNETES

Your Next.js frontend application is now **running in Kubernetes** with 2 replicas for high availability!

## 🚀 Access the Frontend

### Current Setup (Port Forwarding Active)

```bash
# Frontend is accessible at:
http://localhost:3000

# API Gateway is accessible at:
http://localhost:9000
```

### If Port Forwarding Stops

Run these commands to restart access:

```bash
# Terminal 1: API Gateway
kubectl port-forward -n university svc/api-gateway 9000:8000

# Terminal 2: Frontend
kubectl port-forward -n university svc/frontend 3000:3000
```

## 📱 What You Can Do in the Frontend

### 1. Students Management
- **URL**: http://localhost:3000/students
- View all students
- Add new students
- Edit student details
- Delete students

### 2. Courses Management
- **URL**: http://localhost:3000/courses
- View all courses
- Create new courses
- Update course information
- Remove courses

### 3. Faculty Management
- **URL**: http://localhost:3000/faculty
- View all faculty members
- Add new faculty
- Edit faculty profiles
- Delete faculty

### 4. Enrollments Management
- **URL**: http://localhost:3000/enrollments
- View all enrollments
- Enroll students in courses
- Update enrollment status
- Remove enrollments

## 🔗 How Frontend Connects to Backend

### Architecture Flow:
```
Browser → Frontend (localhost:3000)
          ↓
    API Gateway (localhost:9000)
          ↓
    ┌─────────┴──────────┬──────────────┬──────────────┐
    ↓                     ↓              ↓              ↓
Student Service    Course Service  Faculty Service  Enrollment Service
(port 3001)        (port 3002)     (port 3003)      (port 3004)
    ↓                     ↓              ↓              ↓
Student DB         Course DB       Faculty DB       Enrollment DB
```

### API Configuration
The frontend uses a unified API base URL:
```typescript
API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

In Kubernetes, this is set to `http://localhost:9000` (via port-forward)

## 📊 Frontend Kubernetes Resources

### Deployment Details
- **Replicas**: 2 (for high availability)
- **Image**: frontend:latest (Next.js 16.0.5)
- **Port**: 3000
- **Type**: LoadBalancer

### Pod Status
```bash
kubectl get pods -n university -l app=frontend
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
frontend-xxxxxx-xxxxx       1/1     Running   0          Xm
frontend-xxxxxx-xxxxx       1/1     Running   0          Xm
```

### Service Details
```bash
kubectl get svc -n university frontend
```

### View Logs
```bash
# All frontend logs
kubectl logs -n university -l app=frontend --all-containers=true -f

# Specific pod
kubectl logs -n university deployment/frontend -f
```

## 🎯 Testing the Complete Stack

### 1. Test API Gateway
```bash
curl http://localhost:9000/health
# Expected: healthy
```

### 2. Test Backend Services
```bash
# Students
curl http://localhost:9000/api/students

# Courses
curl http://localhost:9000/api/courses

# Faculty
curl http://localhost:9000/api/faculty

# Enrollments
curl http://localhost:9000/api/enrollments
```

### 3. Test Frontend
```bash
# Check if frontend is responding
curl -I http://localhost:3000

# Open in browser
open http://localhost:3000
```

## 🔄 Update Frontend

### After Code Changes

1. **Rebuild Image**
```bash
eval $(minikube docker-env)
docker build -t frontend:latest -f frontend/Dockerfile .
```

2. **Restart Deployment**
```bash
kubectl rollout restart deployment/frontend -n university
```

3. **Check Status**
```bash
kubectl rollout status deployment/frontend -n university
```

## 🐛 Troubleshooting

### Frontend Not Loading
```bash
# Check pod status
kubectl get pods -n university -l app=frontend

# Check logs
kubectl logs -n university deployment/frontend --tail=50

# Restart if needed
kubectl rollout restart deployment/frontend -n university
```

### API Calls Failing
```bash
# Check if API Gateway is accessible
curl http://localhost:9000/health

# Restart API Gateway port-forward
kubectl port-forward -n university svc/api-gateway 9000:8000
```

### Port Already in Use
```bash
# Kill existing port-forward
pkill -f "port-forward.*3000"
pkill -f "port-forward.*9000"

# Restart port forwarding
kubectl port-forward -n university svc/frontend 3000:3000 &
kubectl port-forward -n university svc/api-gateway 9000:8000 &
```

## 🎨 Frontend Features

### Built With
- **Framework**: Next.js 16.0.5 (App Router)
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript 5
- **Deployment**: Standalone mode for optimized Docker

### Production Features
- ✅ Server-side rendering (SSR)
- ✅ Static optimization
- ✅ API route handling
- ✅ TypeScript type safety
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling

## 📈 Scale Frontend

### Increase Replicas
```bash
kubectl scale deployment frontend -n university --replicas=5
```

### Auto-scaling (Horizontal Pod Autoscaler)
```bash
kubectl autoscale deployment frontend -n university \
  --cpu-percent=70 --min=2 --max=10
```

## 🌍 Production Access (Alternative to Port Forward)

### Option 1: Minikube Service
```bash
minikube service frontend -n university
# Opens browser with minikube IP and NodePort
```

### Option 2: Minikube Tunnel
```bash
# Terminal 1
minikube tunnel

# Terminal 2
kubectl get svc -n university frontend
# Access via EXTERNAL-IP shown
```

### Option 3: Ingress (Recommended for Production)
Create an Ingress resource for domain-based routing:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: university-ingress
  namespace: university
spec:
  rules:
  - host: university.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 3000
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-gateway
            port:
              number: 8000
```

## ✨ What Makes This Production-Ready

1. **Container Orchestration** ✅
   - Managed by Kubernetes
   - Auto-restart on failure
   - Rolling updates with zero downtime

2. **High Availability** ✅
   - 2 replicas for redundancy
   - Load balancing between pods
   - Health checks (liveness + readiness)

3. **Scalability** ✅
   - Easy horizontal scaling
   - Can handle increased traffic
   - Resource limits prevent overload

4. **Configuration Management** ✅
   - Environment variables via ConfigMap
   - API URL configured per environment
   - Separation of concerns

5. **Production Build** ✅
   - Optimized Next.js standalone output
   - Minimal Docker image size
   - Fast startup time

## 🎓 For Hackathon Demo

### Show the Judges:

1. **Open Frontend** → http://localhost:3000
   - Explain: "Running in Kubernetes with 2 replicas"

2. **Add a Student**
   - Show form validation
   - Data persists in PostgreSQL StatefulSet

3. **Check Pods**
   ```bash
   kubectl get pods -n university
   ```
   - Explain: "All services are containerized and orchestrated"

4. **Scale Live**
   ```bash
   kubectl scale deployment frontend -n university --replicas=5
   watch kubectl get pods -n university -l app=frontend
   ```
   - Show: "Kubernetes automatically creates new pods"

5. **Show Resilience**
   ```bash
   kubectl delete pod <frontend-pod-name> -n university
   watch kubectl get pods -n university -l app=frontend
   ```
   - Explain: "Kubernetes immediately recreates the pod"

6. **Architecture Diagram**
   - Draw or show: Browser → Frontend → API Gateway → Services → Databases

---

**Status**: ✅ Frontend fully operational on Kubernetes  
**Access**: http://localhost:3000  
**Backend API**: http://localhost:9000  
**Replicas**: 2/2 Running  
**Last Updated**: December 2, 2025
