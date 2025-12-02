# 🎬 Hackathon Demo Guide

## 🚀 Your Setup is COMPLETE!

All 3 hackathon tasks are implemented and working:
- ✅ CI/CD Pipeline
- ✅ Service Mesh/Communication  
- ✅ Observability Stack

---

## 📋 Pre-Demo Setup (5 minutes before)

### 1. Start Minikube
```bash
minikube start
```

### 2. Verify All Pods Running
```bash
kubectl get pods -n university
kubectl get pods -n monitoring
```

Expected: All pods should be in `Running` state (1/1 or 2/2 Ready)

### 3. Start Port Forwards
```bash
# Kill any existing port forwards
pkill -f "port-forward"

# Start fresh port forwards
kubectl port-forward -n university svc/api-gateway 9000:8000 &
kubectl port-forward -n university svc/frontend 3000:3000 &
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80 &

# Give it a moment
sleep 3

echo "✅ All services accessible:"
echo "  Frontend: http://localhost:3000"
echo "  API Gateway: http://localhost:9000"
echo "  Grafana: http://localhost:3001"
```

### 4. Open Browser Tabs (Arrange them)
- Tab 1: http://localhost:3000 (Frontend - Students page)
- Tab 2: http://localhost:3001 (Grafana - Login first)
- Tab 3: Your terminal with this project open
- Tab 4: GitHub repository (show CI/CD workflows)

### 5. Login to Grafana
- URL: http://localhost:3001
- Username: `admin`
- Password: `WheIycbTjLhEGvwW3Hdudzh5aBBRRdZgWPCPVokS`

---

## 🎤 Demo Script (10-15 minutes)

### Part 1: Project Overview (2 min)

**What to say:**
> "I've built a microservices-based university management system with full DevOps automation. The architecture includes 4 independent microservices - Student, Course, Faculty, and Enrollment services - each with its own PostgreSQL database following the database-per-service pattern."

**What to show:**
- Show the project structure in VS Code
- Highlight the `services/` folder with 4 services
- Show `k8s/` folder with Kubernetes manifests

```bash
tree -L 2 services/
tree -L 2 k8s/
```

---

### Part 2: CI/CD Pipeline ✅ (3 min)

**What to say:**
> "Task 1 was implementing a complete CI/CD pipeline. I used GitHub Actions with 7 automated jobs that run on every push."

**What to show:**
1. Open GitHub repository → Actions tab
2. Show the latest workflow run (should be green ✅)
3. Expand the jobs to show:
   - Linting all 4 services
   - Type checking with TypeScript
   - Running tests
   - Building Docker images
   - Security scanning

**Terminal commands:**
```bash
# Show the workflow file
cat .github/workflows/ci-cd.yml

# Show recent workflow runs
gh run list --limit 5
```

**Key Points:**
- Automated testing on every commit
- Parallel execution for speed
- Security scanning included
- All 7 jobs passing ✅

---

### Part 3: Kubernetes Deployment ✅ (3 min)

**What to say:**
> "The application is deployed on Kubernetes with 16 pods running in a minikube cluster. Each service has 2 replicas for high availability, and databases are deployed as StatefulSets with persistent storage."

**What to show:**
```bash
# Show all resources
kubectl get all -n university

# Show pod details with replicas
kubectl get pods -n university -o wide

# Show StatefulSets (databases)
kubectl get statefulsets -n university

# Show services
kubectl get svc -n university
```

**Key Points:**
- 16 pods total (4 DBs + 8 services + 2 frontend + 2 gateway)
- High availability with 2 replicas per service
- Persistent storage for databases
- LoadBalancer services for external access

---

### Part 4: Service Mesh/API Gateway ✅ (2 min)

**What to say:**
> "Task 2 required implementing service communication. I deployed an Nginx-based API Gateway that handles routing, CORS, rate limiting, and security headers. It acts as a single entry point for all microservices."

**What to show:**
```bash
# Show API Gateway configuration
cat k8s/api-gateway/api-gateway.yaml | grep -A 30 "nginx.conf"

# Test API endpoints
curl http://localhost:9000/health
curl http://localhost:9000/api/students
curl http://localhost:9000/api/courses
curl http://localhost:9000/api/faculty
curl http://localhost:9000/api/enrollments
```

**Key Points:**
- Single entry point at port 9000
- CORS headers for frontend
- Rate limiting (10 req/s, burst 20)
- Routes to 4 backend services
- Health check endpoint

---

### Part 5: Frontend Application ✅ (2 min)

**What to say:**
> "The frontend is a Next.js application that communicates with the API Gateway. It provides full CRUD operations for managing students, courses, faculty, and enrollments."

**What to show:**
1. **Switch to browser tab: http://localhost:3000**

2. **Demonstrate CRUD operations:**
   - Show Students list
   - Click "Add Student" → Fill form → Submit
   - Edit a student
   - Show Courses, Faculty, Enrollments pages

3. **Open browser DevTools (F12) → Network tab:**
   - Refresh page
   - Show API calls going to `localhost:9000/api/*`
   - Click on a request → Show response data

**Key Points:**
- Clean, modern UI with shadcn/ui components
- All CRUD operations working
- Direct communication with API Gateway
- Real-time data from microservices

---

### Part 6: Observability Stack ✅ (3 min)

**What to say:**
> "Task 3 was implementing observability. I deployed Prometheus for metrics collection and Grafana for visualization. This gives us real-time monitoring of all services, resource usage, and system health."

**What to show:**
1. **Switch to Grafana tab: http://localhost:3001**

2. **Navigate to Dashboards:**
   - Click "Dashboards" → Search for "Kubernetes"
   - Open "Kubernetes / Compute Resources / Namespace (Pods)"
   - Select namespace: `university`

3. **Show key metrics:**
   - CPU usage per pod
   - Memory usage per pod
   - Network I/O
   - Pod status and restarts

4. **Show Prometheus targets:**
   - Go to "Explore" → Select "Prometheus"
   - Run query: `up{namespace="university"}`
   - Show all targets are up (value = 1)

**Terminal commands:**
```bash
# Show monitoring stack
kubectl get pods -n monitoring

# Show ServiceMonitors (if created)
kubectl get servicemonitors -n monitoring
```

**Key Points:**
- Real-time metrics collection
- Visual dashboards for monitoring
- Can track resource usage and performance
- Alerts can be configured (show AlertManager)

---

## 🎯 Answering Judges' Questions

### Q: Why microservices instead of monolith?
**A:** "Microservices provide independent scalability, technology flexibility, fault isolation, and easier team collaboration. Each service can be deployed, scaled, and updated independently without affecting others."

### Q: How do you handle database consistency across services?
**A:** "I use the database-per-service pattern for isolation. For cross-service transactions, I would implement the Saga pattern or event-driven architecture with message queues like RabbitMQ or Kafka for eventual consistency."

### Q: What about production deployment?
**A:** "This minikube setup demonstrates the architecture. For production, I would deploy to AWS EKS, Google GKE, or Azure AKS, use managed databases, implement Ingress with SSL certificates, add horizontal pod autoscaling, and integrate with a proper secrets management system like AWS Secrets Manager or HashiCorp Vault."

### Q: How do you ensure security?
**A:** "Multiple layers: API Gateway with rate limiting, Kubernetes network policies, secrets management, RBAC for cluster access, regular security scanning in CI/CD, and HTTPS/TLS in production."

### Q: What if a service goes down?
**A:** "High availability with 2 replicas per service, liveness and readiness probes for automatic restart, LoadBalancer distributes traffic, and Prometheus alerts notify us immediately. In production, I'd add circuit breakers and retry logic."

### Q: How do you monitor in production?
**A:** "The Prometheus + Grafana stack we have, plus distributed tracing with Jaeger or Zipkin, centralized logging with ELK stack, and APM tools like Datadog or New Relic for deeper insights."

---

## 🐛 Common Issues & Quick Fixes

### Port forward died
```bash
pkill -f "port-forward"
kubectl port-forward -n university svc/api-gateway 9000:8000 &
kubectl port-forward -n university svc/frontend 3000:3000 &
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80 &
```

### Pod not running
```bash
# Check pod status
kubectl get pods -n university

# Describe problematic pod
kubectl describe pod <pod-name> -n university

# Check logs
kubectl logs <pod-name> -n university

# Restart deployment
kubectl rollout restart deployment/<deployment-name> -n university
```

### Minikube not responding
```bash
# Stop and start fresh
minikube stop
minikube start

# Verify
kubectl get nodes
```

### Frontend not loading data
```bash
# Check API Gateway
curl http://localhost:9000/health

# Check if services are up
kubectl get pods -n university -l tier=service

# Check frontend logs
kubectl logs -f deployment/frontend -n university
```

---

## 💡 Pro Tips for Demo Day

1. **Practice the flow** - Run through the entire demo 2-3 times
2. **Have backup** - Keep screenshots in case of technical issues
3. **Time yourself** - Keep it under 15 minutes with buffer for questions
4. **Be confident** - You built a production-grade system!
5. **Emphasize automation** - The CI/CD pipeline does everything automatically
6. **Show scalability** - Demonstrate how easy it is to scale:
   ```bash
   kubectl scale deployment/student-service --replicas=4 -n university
   ```
7. **Mention trade-offs** - Show you understand the complexity vs benefits

---

## 🚀 Quick Start Commands (Day of Demo)

```bash
# 1. Start everything
minikube start
sleep 30

# 2. Verify
kubectl get pods -n university
kubectl get pods -n monitoring

# 3. Port forwards
pkill -f "port-forward"
kubectl port-forward -n university svc/api-gateway 9000:8000 &
kubectl port-forward -n university svc/frontend 3000:3000 &
kubectl port-forward -n monitoring svc/prometheus-grafana 3001:80 &
sleep 3

# 4. Test
curl http://localhost:9000/health
open http://localhost:3000
open http://localhost:3001

# 5. You're ready! 🎉
```

---

## 📊 Architecture Diagram (Explain This)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─► http://localhost:3000 (Frontend)
       │   └─► Next.js App
       │
       └─► http://localhost:9000 (API Gateway)
           └─► Nginx Reverse Proxy
               ├─► Student Service (Port 3001)  → PostgreSQL
               ├─► Course Service (Port 3002)   → PostgreSQL
               ├─► Faculty Service (Port 3003)  → PostgreSQL
               └─► Enrollment Service (Port 3004) → PostgreSQL

┌──────────────────────────────────────────┐
│         Kubernetes Cluster (Minikube)     │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  Namespace: university              │ │
│  │  - 4 Databases (StatefulSets)       │ │
│  │  - 4 Services (2 replicas each)     │ │
│  │  - 1 Frontend (2 replicas)          │ │
│  │  - 1 API Gateway (2 replicas)       │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  Namespace: monitoring              │ │
│  │  - Prometheus (metrics)             │ │
│  │  - Grafana (visualization)          │ │
│  │  - AlertManager (alerts)            │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 🏆 Your Strengths - What Sets You Apart

1. **Complete Implementation** - All 3 tasks fully working
2. **Production-Ready Patterns** - Database-per-service, health checks, replicas
3. **Automation** - CI/CD pipeline with 7 jobs
4. **Observability** - Full monitoring stack implemented
5. **Modern Stack** - TypeScript, Next.js, PostgreSQL, Kubernetes
6. **Clean Architecture** - Well-organized codebase, proper separation of concerns
7. **Documentation** - Comprehensive README and deployment guides

---

## ✅ Final Checklist

Before the demo:
- [ ] Minikube running
- [ ] All 16 pods in university namespace running
- [ ] Monitoring pods running
- [ ] Port forwards active (3000, 3001, 9000)
- [ ] Frontend loads in browser
- [ ] Grafana accessible and logged in
- [ ] GitHub Actions workflows passing
- [ ] Practiced the demo flow
- [ ] Terminal and browser windows arranged
- [ ] Confident and ready! 🚀

---

**You're ready to impress the judges! Good luck! 🎉**
