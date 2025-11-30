# API Gateway Configuration

## Overview
The API Gateway provides a single entry point for all microservices, running on **port 8080**.

## Architecture

```
Client/Frontend (Port 3000)
         ↓
API Gateway (Nginx - Port 8080)
         ↓
    ┌────┴────┬─────────┬──────────┐
    ↓         ↓         ↓          ↓
Student   Course   Faculty   Enrollment
Service   Service  Service    Service
(3001)    (3002)   (3003)     (3004)
```

## API Routes

### Base URL
```
http://localhost:8080
```

### Endpoints

#### Student Service
```
GET    /api/students          → http://student-service:3001/api/students
POST   /api/students          → http://student-service:3001/api/students
GET    /api/students/:id      → http://student-service:3001/api/students/:id
PUT    /api/students/:id      → http://student-service:3001/api/students/:id
DELETE /api/students/:id      → http://student-service:3001/api/students/:id
```

#### Course Service
```
GET    /api/courses           → http://course-service:3002/api/courses
POST   /api/courses           → http://course-service:3002/api/courses
GET    /api/courses/:id       → http://course-service:3002/api/courses/:id
PUT    /api/courses/:id       → http://course-service:3002/api/courses/:id
DELETE /api/courses/:id       → http://course-service:3002/api/courses/:id
```

#### Faculty Service
```
GET    /api/faculty           → http://faculty-service:3003/api/faculty
POST   /api/faculty           → http://faculty-service:3003/api/faculty
GET    /api/faculty/:id       → http://faculty-service:3003/api/faculty/:id
PUT    /api/faculty/:id       → http://faculty-service:3003/api/faculty/:id
DELETE /api/faculty/:id       → http://faculty-service:3003/api/faculty/:id
```

#### Enrollment Service
```
GET    /api/enrollments       → http://enrollment-service:3004/api/enrollments
POST   /api/enrollments       → http://enrollment-service:3004/api/enrollments
GET    /api/enrollments/:id   → http://enrollment-service:3004/api/enrollments/:id
PUT    /api/enrollments/:id   → http://enrollment-service:3004/api/enrollments/:id
DELETE /api/enrollments/:id   → http://enrollment-service:3004/api/enrollments/:id
```

## Health Check Endpoints

### Gateway Health
```bash
curl http://localhost:8080/health
# Response: API Gateway is healthy
```

### Individual Service Health Checks
```bash
# Student Service
curl http://localhost:8080/health/student

# Course Service
curl http://localhost:8080/health/course

# Faculty Service
curl http://localhost:8080/health/faculty

# Enrollment Service
curl http://localhost:8080/health/enrollment
```

## Features

### ✅ Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### ✅ Error Handling
- Automatic 503 responses when services are unavailable
- Custom error messages in JSON format
- 404 handling for unknown routes

### ✅ Proxy Configuration
- Forwards client IP address (`X-Real-IP`, `X-Forwarded-For`)
- 60-second timeouts for backend services
- Automatic retry on service unavailability

### ✅ Load Balancing Ready
Each upstream block can be extended with multiple servers:
```nginx
upstream student_service {
    server student-service-1:3001;
    server student-service-2:3001;
    server student-service-3:3001;
}
```

## Testing the Gateway

### 1. Start all services
```bash
docker-compose up -d
```

### 2. Check gateway status
```bash
curl http://localhost:8080/health
```

### 3. Test student service through gateway
```bash
# Get all students
curl http://localhost:8080/api/students

# Create a student
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@university.edu",
    "phone": "+1234567890",
    "studentId": "STU001"
  }'
```

### 4. Test course service through gateway
```bash
curl http://localhost:8080/api/courses
```

### 5. Test faculty service through gateway
```bash
curl http://localhost:8080/api/faculty
```

### 6. Test enrollment service through gateway
```bash
curl http://localhost:8080/api/enrollments
```

## Frontend Integration

The frontend now uses the API Gateway as a single entry point:

```typescript
// All API calls go through port 8080
NEXT_PUBLIC_STUDENT_API_URL=http://localhost:8080/api
NEXT_PUBLIC_COURSE_API_URL=http://localhost:8080/api
NEXT_PUBLIC_FACULTY_API_URL=http://localhost:8080/api
NEXT_PUBLIC_ENROLLMENT_API_URL=http://localhost:8080/api
```

## Benefits

### 🎯 Single Entry Point
- Clients only need to know one URL (port 8080)
- Simplifies frontend configuration

### 🔒 Security
- Centralized security policies
- Can add authentication/authorization at gateway level
- Rate limiting can be implemented here

### 📊 Monitoring
- Centralized logging for all API requests
- Easy to add metrics collection
- Single point for request/response tracking

### 🚀 Scalability
- Can add multiple instances of each service
- Nginx handles load balancing automatically
- Easy to add caching layer

### 🛠️ Flexibility
- Can route based on headers, query params, etc.
- Easy to add API versioning (e.g., `/api/v1`, `/api/v2`)
- Can implement A/B testing

## Future Enhancements

### 1. Rate Limiting
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api {
    limit_req zone=api_limit burst=20 nodelay;
}
```

### 2. Caching
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;

location /api/students {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
}
```

### 3. SSL/TLS
```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
}
```

### 4. JWT Authentication
```nginx
location /api {
    auth_request /auth;
}

location = /auth {
    internal;
    proxy_pass http://auth-service/validate;
}
```

## Troubleshooting

### Gateway not responding
```bash
# Check if gateway is running
docker ps | grep api-gateway

# Check gateway logs
docker logs api-gateway

# Restart gateway
docker-compose restart api-gateway
```

### Service unreachable through gateway
```bash
# Check if backend service is healthy
curl http://localhost:3001/health  # Direct service access
curl http://localhost:8080/health/student  # Through gateway

# Check nginx configuration
docker exec api-gateway nginx -t

# View nginx logs
docker logs api-gateway --tail=50
```

### CORS issues
Add CORS headers to nginx.conf if needed:
```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type, Authorization";
```
