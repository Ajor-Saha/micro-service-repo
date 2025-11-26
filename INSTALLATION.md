# Installation Guide

## Quick Start Commands

Follow these commands in order to set up and run the University Management System:

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Build and install shared package
cd shared
npm install
npm run build
cd ..

# Install all service dependencies
cd services/student-service && npm install && cd ../..
cd services/course-service && npm install && cd ../..
cd services/faculty-service && npm install && cd ../..
cd services/enrollment-service && npm install && cd ../..
```

### 2. Set Up Environment Variables

```bash
# Copy environment files for all services
cp services/student-service/.env.example services/student-service/.env
cp services/course-service/.env.example services/course-service/.env
cp services/faculty-service/.env.example services/faculty-service/.env
cp services/enrollment-service/.env.example services/enrollment-service/.env
```

### 3. Set Up PostgreSQL Databases

**Option A: Using local PostgreSQL**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create databases
CREATE DATABASE student_db;
CREATE DATABASE course_db;
CREATE DATABASE faculty_db;
CREATE DATABASE enrollment_db;

# Exit
\q
```

**Option B: Using Docker for databases only**

```bash
# Start only the database containers
docker-compose up -d student-db course-db faculty-db enrollment-db
```

### 4. Run Database Migrations

```bash
# Push schemas to databases
cd services/student-service && npm run db:migrate && cd ../..
cd services/course-service && npm run db:migrate && cd ../..
cd services/faculty-service && npm run db:migrate && cd ../..
cd services/enrollment-service && npm run db:migrate && cd ../..
```

### 5. Start All Services

**Option A: Development Mode (Separate Terminals)**

```bash
# Terminal 1 - Student Service
npm run dev:student

# Terminal 2 - Course Service
npm run dev:course

# Terminal 3 - Faculty Service
npm run dev:faculty

# Terminal 4 - Enrollment Service
npm run dev:enrollment
```

**Option B: Using Docker Compose (Recommended)**

```bash
# Start all services and databases
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Option C: Using tmux/screen (Single Terminal)**

```bash
# Install tmux if not available
brew install tmux  # macOS
# or
sudo apt-get install tmux  # Linux

# Create a new tmux session
tmux new-session -s university-services

# Split terminal and run services
# Ctrl+b then " (split horizontally)
# Ctrl+b then % (split vertically)
# Ctrl+b then arrow keys (navigate between panes)

# In each pane, run:
npm run dev:student
npm run dev:course
npm run dev:faculty
npm run dev:enrollment
```

### 6. Verify Services Are Running

```bash
# Check all health endpoints
curl http://localhost:3001/health  # Student Service
curl http://localhost:3002/health  # Course Service
curl http://localhost:3003/health  # Faculty Service
curl http://localhost:3004/health  # Enrollment Service
```

Expected response for each:
```json
{"status":"ok","service":"<service-name>"}
```

## One-Line Installation (All at once)

```bash
npm install && cd shared && npm install && npm run build && cd .. && cd services/student-service && npm install && cd ../course-service && npm install && cd ../faculty-service && npm install && cd ../enrollment-service && npm install && cd ../../.. && cp services/student-service/.env.example services/student-service/.env && cp services/course-service/.env.example services/course-service/.env && cp services/faculty-service/.env.example services/faculty-service/.env && cp services/enrollment-service/.env.example services/enrollment-service/.env
```

## Testing the API

### Create a Student
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

### Create a Course
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

### Create an Enrollment
```bash
curl -X POST http://localhost:3004/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseId": 1,
    "status": "active"
  }'
```

### Get All Students
```bash
curl http://localhost:3001/api/students
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# For other ports: 3002, 3003, 3004
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d student_db -c "SELECT 1;"
```

### Module Not Found Errors
```bash
# Rebuild shared package
cd shared && npm run build && cd ..

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Service URLs

- Student Service: http://localhost:3001
- Course Service: http://localhost:3002
- Faculty Service: http://localhost:3003
- Enrollment Service: http://localhost:3004

## Database Ports

- Student DB: localhost:5432
- Course DB: localhost:5433
- Faculty DB: localhost:5434
- Enrollment DB: localhost:5435

(When using Docker Compose)
