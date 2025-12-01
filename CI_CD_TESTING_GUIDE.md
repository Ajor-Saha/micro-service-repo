# CI/CD Testing Guide

## 🚀 How to Test Your CI/CD Pipeline

### **Option 1: Test Locally Before Pushing** ✅ (Recommended)

#### 1. **Test Backend Services Build**
```bash
# Test shared package build
cd shared
npm ci
npm run build
cd ..

# Test each service
cd services/student-service
npm ci
npm run build
cd ../..

cd services/course-service
npm ci
npm run build
cd ../..

# Repeat for faculty-service and enrollment-service
```

#### 2. **Test Frontend Build**
```bash
cd frontend
npm ci
npm run lint
NEXT_PUBLIC_STUDENT_API_URL=http://localhost:8000/api \
NEXT_PUBLIC_COURSE_API_URL=http://localhost:8000/api \
NEXT_PUBLIC_FACULTY_API_URL=http://localhost:8000/api \
NEXT_PUBLIC_ENROLLMENT_API_URL=http://localhost:8000/api \
npm run build
cd ..
```

#### 3. **Test Docker Builds Locally**
```bash
# Build all services
docker-compose build

# Or build individually
docker-compose build student-service
docker-compose build course-service
docker-compose build faculty-service
docker-compose build enrollment-service
docker-compose build frontend
```

#### 4. **Test Integration (Full Stack)**
```bash
# Start all services
docker-compose up -d

# Wait for services to be healthy
sleep 45

# Run integration tests
bash test-api.sh

# Check logs if needed
docker-compose logs -f

# Stop services
docker-compose down -v
```

---

### **Option 2: Test on GitHub Actions** 🎯

#### **Step 1: Push to a Test Branch**
```bash
# Create a test branch
git checkout -b test/ci-cd-pipeline

# Add the CI/CD workflow
git add .github/workflows/ci-cd.yml
git add Dockerfile.nginx
git commit -m "feat: add CI/CD pipeline"

# Push to GitHub
git push origin test/ci-cd-pipeline
```

#### **Step 2: Watch the Pipeline Run**
1. Go to your GitHub repository
2. Click on "Actions" tab
3. You'll see the workflow running
4. Click on the workflow run to see details

#### **Step 3: Check Each Job**
The pipeline has 7 jobs that will run:
- ✅ **Build Backend Services** (4 services in parallel)
- ✅ **Build Frontend** (lint + build)
- ✅ **Build Docker Images** (6 images in parallel)
- ✅ **Integration Tests** (full stack testing)
- ✅ **Security Scan** (Trivy + npm audit)
- ✅ **Performance Tests** (load testing)
- ✅ **Deploy Summary** (results)

---

### **Option 3: Manual Trigger (Best for Testing)** 🎮

The workflow supports `workflow_dispatch`, so you can trigger it manually:

1. Go to GitHub → Actions → "Microservices CI/CD Pipeline"
2. Click "Run workflow"
3. Select your branch
4. Click "Run workflow"

---

## 🔍 **What Gets Tested**

### **Build Stage**
- ✅ Shared package compilation
- ✅ All 4 backend services compilation
- ✅ Frontend build with environment variables
- ✅ Docker images for all services

### **Integration Tests**
- ✅ API Gateway health check
- ✅ Student Service CRUD operations
- ✅ Course Service CRUD operations
- ✅ Faculty Service CRUD operations
- ✅ Enrollment Service CRUD operations
- ✅ Frontend accessibility
- ✅ Full CRUD workflow (create student → create course → enroll)

### **Security Checks**
- ✅ Trivy vulnerability scanning
- ✅ npm audit for all services
- ✅ Dependency vulnerability checks
- ✅ Critical/High severity detection

### **Performance Tests**
- ✅ Load testing with Apache Bench
- ✅ 100 requests to each service
- ✅ 500 requests to API Gateway
- ✅ Concurrent request handling

---

## 📊 **Expected Results**

### **Successful Pipeline Output**
```
✅ build-backend (student-service) - 2m 15s
✅ build-backend (course-service) - 2m 10s
✅ build-backend (faculty-service) - 2m 12s
✅ build-backend (enrollment-service) - 2m 18s
✅ build-frontend - 1m 45s
✅ build-docker (6 images) - 5m 30s
✅ integration-test - 3m 20s
✅ security-scan - 1m 15s
✅ performance-test - 2m 45s
✅ deploy-summary - 15s

Total time: ~8-10 minutes
```

---

## 🐛 **Troubleshooting**

### **If Build Fails:**
```bash
# Check local build first
cd services/student-service
npm ci
npm run build

# Check for TypeScript errors
npm run build 2>&1 | grep error
```

### **If Docker Build Fails:**
```bash
# Test Docker build locally
docker-compose build student-service --no-cache

# Check Docker logs
docker-compose logs student-service
```

### **If Integration Tests Fail:**
```bash
# Start services locally
docker-compose up -d

# Wait and check health
sleep 30
docker-compose ps

# Test manually
curl http://localhost:8000/health
curl http://localhost:8000/api/students

# Check logs
docker-compose logs api-gateway
docker-compose logs student-service
```

### **If Security Scan Fails:**
```bash
# Run npm audit locally
cd services/student-service
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies if needed
npm update
```

---

## 🎯 **Quick Test Commands**

### **Test Everything Locally (5 minutes)**
```bash
# One-liner to test everything
docker-compose build && \
docker-compose up -d && \
sleep 45 && \
bash test-api.sh && \
docker-compose down -v
```

### **Test Build Only (2 minutes)**
```bash
# Just test if everything compiles
cd shared && npm ci && npm run build && cd .. && \
cd services/student-service && npm ci && npm run build && cd ../.. && \
cd services/course-service && npm ci && npm run build && cd ../.. && \
cd services/faculty-service && npm ci && npm run build && cd ../.. && \
cd services/enrollment-service && npm ci && npm run build && cd ../.. && \
cd frontend && npm ci && npm run build && cd ..
```

---

## 📝 **CI/CD Pipeline Features**

### **Parallel Execution** ⚡
- 4 backend services build in parallel
- 6 Docker images build in parallel
- Faster pipeline completion (~8 mins vs 20+ mins sequential)

### **Caching** 🚀
- Node.js dependency caching
- Docker layer caching (GitHub Actions cache)
- Significantly faster subsequent runs

### **Matrix Strategy** 🎯
- Services tested independently
- One failure doesn't block others
- Better visibility into which service failed

### **Security First** 🔒
- Trivy scans for vulnerabilities
- npm audit for all packages
- Results uploaded to GitHub Security tab
- SARIF format for detailed reports

### **Comprehensive Testing** ✅
- Build validation
- Integration tests
- Performance tests
- Security scans
- Full CRUD workflow validation

---

## 🎉 **Next Steps After CI/CD Setup**

1. **Merge to main:**
   ```bash
   git checkout main
   git merge test/ci-cd-pipeline
   git push origin main
   ```

2. **Enable Branch Protection:**
   - Go to Settings → Branches
   - Add rule for `main`
   - Require status checks (CI/CD pipeline)
   - Require pull request reviews

3. **Set up Environments:**
   - Add `staging` environment in GitHub
   - Add `production` environment in GitHub
   - Configure deployment secrets

4. **Add Badges to README:**
   ```markdown
   ![CI/CD](https://github.com/Ajor-Saha/micro-service-repo/actions/workflows/ci-cd.yml/badge.svg)
   ```

---

## 📚 **Additional Resources**

- **GitHub Actions Docs:** https://docs.github.com/actions
- **Docker Multi-stage Builds:** https://docs.docker.com/build/building/multi-stage/
- **Trivy Scanner:** https://github.com/aquasecurity/trivy
- **Apache Bench:** https://httpd.apache.org/docs/2.4/programs/ab.html

---

## ✨ **Tips for Hackathon Demo**

1. **Show the pipeline running live** in GitHub Actions
2. **Point out parallel execution** (faster = better)
3. **Show security scanning** results (professional!)
4. **Demo the tests passing** (reliability)
5. **Show Docker images** in GitHub Container Registry
6. **Explain caching benefits** (cost-efficient)

**Judges will be impressed by:**
- ✅ Automated testing
- ✅ Security scanning
- ✅ Parallel execution
- ✅ Professional workflow structure
- ✅ Comprehensive test coverage

---

**Your CI/CD pipeline is now PRODUCTION-READY!** 🚀
