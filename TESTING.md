# Testing Guide

## Prerequisites

Make sure all services are running. You need 4 terminal windows:

### Terminal 1 - Student Service
```bash
cd /Users/ajorsaha/Desktop/Backend/micro-services/preli-demo
npm run dev:student
```

### Terminal 2 - Course Service
```bash
cd /Users/ajorsaha/Desktop/Backend/micro-services/preli-demo
npm run dev:course
```

### Terminal 3 - Faculty Service
```bash
cd /Users/ajorsaha/Desktop/Backend/micro-services/preli-demo
npm run dev:faculty
```

### Terminal 4 - Enrollment Service
```bash
cd /Users/ajorsaha/Desktop/Backend/micro-services/preli-demo
npm run dev:enrollment
```

---

## Quick Test - Automated

Run the automated test script:

```bash
./test-api.sh
```

This will test all endpoints and create sample data.

---

## Manual Testing

### 1. Check Health of All Services

```bash
curl http://localhost:3001/health  # Student Service
curl http://localhost:3002/health  # Course Service
curl http://localhost:3003/health  # Faculty Service
curl http://localhost:3004/health  # Enrollment Service
```

### 2. Create a Student

```bash
curl -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "studentId": "STU001",
    "phone": "+1234567890"
  }'
```

### 3. Get All Students

```bash
curl http://localhost:3001/api/students
```

### 4. Get Student by ID

```bash
curl http://localhost:3001/api/students/1
```

### 5. Update Student

```bash
curl -X PUT http://localhost:3001/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+0987654321"
  }'
```

### 6. Create a Course

```bash
curl -X POST http://localhost:3002/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Introduction to Computer Science",
    "credits": 3,
    "department": "Computer Science"
  }'
```

### 7. Get All Courses

```bash
curl http://localhost:3002/api/courses
```

### 8. Create a Faculty Member

```bash
curl -X POST http://localhost:3003/api/faculty \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@university.edu",
    "employeeId": "FAC001",
    "department": "Computer Science",
    "designation": "Professor"
  }'
```

### 9. Get All Faculty

```bash
curl http://localhost:3003/api/faculty
```

### 10. Create an Enrollment

```bash
curl -X POST http://localhost:3004/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseId": 1,
    "status": "active"
  }'
```

### 11. Get Enrollments by Student

```bash
curl http://localhost:3004/api/enrollments/student/1
```

### 12. Get Enrollments by Course

```bash
curl http://localhost:3004/api/enrollments/course/1
```

### 13. Update Enrollment (Add Grade)

```bash
curl -X PUT http://localhost:3004/api/enrollments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "grade": "A"
  }'
```

### 14. Delete Operations

```bash
# Delete enrollment
curl -X DELETE http://localhost:3004/api/enrollments/1

# Delete student
curl -X DELETE http://localhost:3001/api/students/1

# Delete course
curl -X DELETE http://localhost:3002/api/courses/1

# Delete faculty
curl -X DELETE http://localhost:3003/api/faculty/1
```

---

## Using Postman

1. Import this collection URL or create requests manually
2. Set base URLs:
   - Student: `http://localhost:3001`
   - Course: `http://localhost:3002`
   - Faculty: `http://localhost:3003`
   - Enrollment: `http://localhost:3004`

---

## Test Scenarios

### Scenario 1: Complete Student Enrollment Flow

```bash
# 1. Create student
curl -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alice","lastName":"Johnson","email":"alice@university.edu","studentId":"STU002","phone":"+1111111111"}'

# 2. Create course
curl -X POST http://localhost:3002/api/courses \
  -H "Content-Type: application/json" \
  -d '{"courseCode":"MATH101","courseName":"Calculus I","credits":4,"department":"Mathematics"}'

# 3. Enroll student
curl -X POST http://localhost:3004/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId":2,"courseId":2,"status":"active","semester":"Fall 2024"}'

# 4. View student enrollments
curl http://localhost:3004/api/enrollments/student/2
```

### Scenario 2: Invalid Enrollment (Should Fail)

```bash
# Try to enroll non-existent student
curl -X POST http://localhost:3004/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId":9999,"courseId":1,"status":"active"}'

# Expected: 404 Student not found
```

---

## Expected Responses

### Success Response
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "firstName": "John",
    ...
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## Troubleshooting

### Service not responding
```bash
# Check if service is running
lsof -i :3001  # or 3002, 3003, 3004

# Restart service
# Ctrl+C in service terminal, then npm run dev again
```

### Database connection error
```bash
# Check if databases are running
docker ps

# Restart databases
docker-compose restart student-db course-db faculty-db enrollment-db
```

### Port already in use
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```
