#!/bin/bash

echo "========================================="
echo "Testing University Management System APIs"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test health endpoints
echo -e "${BLUE}1. Testing Health Endpoints${NC}"
echo "-----------------------------------"

echo -e "${GREEN}Student Service:${NC}"
curl -s http://localhost:3001/health | jq '.' || curl -s http://localhost:3001/health
echo ""

echo -e "${GREEN}Course Service:${NC}"
curl -s http://localhost:3002/health | jq '.' || curl -s http://localhost:3002/health
echo ""

echo -e "${GREEN}Faculty Service:${NC}"
curl -s http://localhost:3003/health | jq '.' || curl -s http://localhost:3003/health
echo ""

echo -e "${GREEN}Enrollment Service:${NC}"
curl -s http://localhost:3004/health | jq '.' || curl -s http://localhost:3004/health
echo ""
echo ""

# Create a student
echo -e "${BLUE}2. Creating a Student${NC}"
echo "-----------------------------------"
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "studentId": "STU001",
    "phone": "+1234567890",
    "dateOfBirth": "2000-01-15",
    "address": "123 Main St, City, State"
  }')

echo "$STUDENT_RESPONSE" | jq '.' || echo "$STUDENT_RESPONSE"
STUDENT_ID=$(echo "$STUDENT_RESPONSE" | jq -r '.data.id' 2>/dev/null || echo "1")
echo ""

# Create a course
echo -e "${BLUE}3. Creating a Course${NC}"
echo "-----------------------------------"
COURSE_RESPONSE=$(curl -s -X POST http://localhost:3002/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Introduction to Computer Science",
    "description": "Fundamentals of programming",
    "credits": 3,
    "department": "Computer Science",
    "semester": "Fall 2024",
    "maxStudents": 30
  }')

echo "$COURSE_RESPONSE" | jq '.' || echo "$COURSE_RESPONSE"
COURSE_ID=$(echo "$COURSE_RESPONSE" | jq -r '.data.id' 2>/dev/null || echo "1")
echo ""

# Create a faculty
echo -e "${BLUE}4. Creating a Faculty Member${NC}"
echo "-----------------------------------"
curl -s -X POST http://localhost:3003/api/faculty \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@university.edu",
    "employeeId": "FAC001",
    "phone": "+1234567890",
    "department": "Computer Science",
    "designation": "Professor"
  }' | jq '.' || curl -s -X POST http://localhost:3003/api/faculty \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@university.edu",
    "employeeId": "FAC001",
    "phone": "+1234567890",
    "department": "Computer Science",
    "designation": "Professor"
  }'
echo ""

# Create enrollment
echo -e "${BLUE}5. Creating an Enrollment${NC}"
echo "-----------------------------------"
curl -s -X POST http://localhost:3004/api/enrollments \
  -H "Content-Type: application/json" \
  -d "{
    \"studentId\": $STUDENT_ID,
    \"courseId\": $COURSE_ID,
    \"status\": \"active\",
    \"semester\": \"Fall 2024\",
    \"academicYear\": \"2024-2025\"
  }" | jq '.' || curl -s -X POST http://localhost:3004/api/enrollments \
  -H "Content-Type: application/json" \
  -d "{
    \"studentId\": $STUDENT_ID,
    \"courseId\": $COURSE_ID,
    \"status\": \"active\",
    \"semester\": \"Fall 2024\",
    \"academicYear\": \"2024-2025\"
  }"
echo ""

# Get all students
echo -e "${BLUE}6. Getting All Students${NC}"
echo "-----------------------------------"
curl -s http://localhost:3001/api/students | jq '.' || curl -s http://localhost:3001/api/students
echo ""

# Get all courses
echo -e "${BLUE}7. Getting All Courses${NC}"
echo "-----------------------------------"
curl -s http://localhost:3002/api/courses | jq '.' || curl -s http://localhost:3002/api/courses
echo ""

# Get all faculty
echo -e "${BLUE}8. Getting All Faculty${NC}"
echo "-----------------------------------"
curl -s http://localhost:3003/api/faculty | jq '.' || curl -s http://localhost:3003/api/faculty
echo ""

# Get all enrollments
echo -e "${BLUE}9. Getting All Enrollments${NC}"
echo "-----------------------------------"
curl -s http://localhost:3004/api/enrollments | jq '.' || curl -s http://localhost:3004/api/enrollments
echo ""

# Get enrollments by student
echo -e "${BLUE}10. Getting Enrollments for Student $STUDENT_ID${NC}"
echo "-----------------------------------"
curl -s http://localhost:3004/api/enrollments/student/$STUDENT_ID | jq '.' || curl -s http://localhost:3004/api/enrollments/student/$STUDENT_ID
echo ""

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
