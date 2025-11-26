# University Management System - Microservices

A comprehensive microservices-based University Management System built with Node.js, Express, TypeScript, Drizzle ORM, and PostgreSQL.

## 🏗️ Architecture

This system consists of four independent microservices:

- **Student Service** (Port 3001) - Manages student information
- **Course Service** (Port 3002) - Manages course catalog
- **Faculty Service** (Port 3003) - Manages faculty members
- **Enrollment Service** (Port 3004) - Manages student course enrollments

Each service has its own PostgreSQL database to ensure data isolation and independence.

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Logging**: Winston
- **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd preli-demo
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install shared package dependencies
   cd shared && npm install && cd ..

   # Install service dependencies
   cd services/student-service && npm install && cd ../..
   cd services/course-service && npm install && cd ../..
   cd services/faculty-service && npm install && cd ../..
   cd services/enrollment-service && npm install && cd ../..
   ```

3. **Set up environment variables**

   Copy the `.env.example` file in each service directory and configure:

   ```bash
   # Student Service
   cp services/student-service/.env.example services/student-service/.env

   # Course Service
   cp services/course-service/.env.example services/course-service/.env

   # Faculty Service
   cp services/faculty-service/.env.example services/faculty-service/.env

   # Enrollment Service
   cp services/enrollment-service/.env.example services/enrollment-service/.env
   ```

4. **Set up PostgreSQL databases**

   Create four databases:
   ```sql
   CREATE DATABASE student_db;
   CREATE DATABASE course_db;
   CREATE DATABASE faculty_db;
   CREATE DATABASE enrollment_db;
   ```

5. **Run database migrations**
   ```bash
   cd services/student-service && npm run db:migrate && cd ../..
   cd services/course-service && npm run db:migrate && cd ../..
   cd services/faculty-service && npm run db:migrate && cd ../..
   cd services/enrollment-service && npm run db:migrate && cd ../..
   ```

6. **Build shared package**
   ```bash
   cd shared && npm run build && cd ..
   ```

7. **Start the services**

   In separate terminal windows:
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

### 🐳 Using Docker

Start all services with Docker Compose:

```bash
docker-compose up -d
```

Stop all services:

```bash
docker-compose down
```

## 📚 API Documentation

### Student Service (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/health` | Health check |

**Student Schema:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "studentId": "string",
  "dateOfBirth": "string",
  "address": "string"
}
```

### Course Service (Port 3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course by ID |
| POST | `/api/courses` | Create new course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |
| GET | `/health` | Health check |

**Course Schema:**
```json
{
  "courseCode": "string",
  "courseName": "string",
  "description": "string",
  "credits": "number",
  "department": "string",
  "semester": "string",
  "maxStudents": "number"
}
```

### Faculty Service (Port 3003)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faculty` | Get all faculty |
| GET | `/api/faculty/:id` | Get faculty by ID |
| POST | `/api/faculty` | Create new faculty |
| PUT | `/api/faculty/:id` | Update faculty |
| DELETE | `/api/faculty/:id` | Delete faculty |
| GET | `/health` | Health check |

**Faculty Schema:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "employeeId": "string",
  "department": "string",
  "designation": "string",
  "specialization": "string",
  "hireDate": "string"
}
```

### Enrollment Service (Port 3004)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments` | Get all enrollments |
| GET | `/api/enrollments/:id` | Get enrollment by ID |
| GET | `/api/enrollments/student/:studentId` | Get enrollments by student |
| GET | `/api/enrollments/course/:courseId` | Get enrollments by course |
| POST | `/api/enrollments` | Create new enrollment |
| PUT | `/api/enrollments/:id` | Update enrollment |
| DELETE | `/api/enrollments/:id` | Delete enrollment |
| GET | `/health` | Health check |

**Enrollment Schema:**
```json
{
  "studentId": "number",
  "courseId": "number",
  "status": "active|completed|dropped",
  "semester": "string",
  "academicYear": "string",
  "grade": "string"
}
```

## 🧪 Testing APIs

Use curl, Postman, or any HTTP client:

```bash
# Create a student
curl -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "studentId": "STU001",
    "phone": "+1234567890"
  }'

# Create a course
curl -X POST http://localhost:3002/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Introduction to Computer Science",
    "credits": 3,
    "department": "Computer Science"
  }'

# Enroll student in course
curl -X POST http://localhost:3004/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseId": 1,
    "status": "active"
  }'
```

## 📁 Project Structure

```
preli-demo/
├── services/
│   ├── student-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── db/
│   │   │   ├── routes/
│   │   │   ├── validators/
│   │   │   └── app.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   ├── course-service/
│   ├── faculty-service/
│   └── enrollment-service/
├── shared/
│   └── src/
│       ├── middleware/
│       └── utils/
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔧 Development

- Each service runs independently on its own port
- Hot-reload enabled in development mode
- Shared utilities available in `@university/shared` package
- Database migrations managed by Drizzle Kit

## 🛡️ Error Handling

All services use centralized error handling with:
- Custom `AppError` class for operational errors
- Global error handler middleware
- Validation errors from Zod schemas
- Structured logging with Winston

## 🔐 Security

- Input validation using Zod
- CORS enabled
- Environment variables for sensitive data
- SQL injection prevention via Drizzle ORM

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please follow the existing code structure and patterns.
