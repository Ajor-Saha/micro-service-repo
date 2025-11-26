# Enrollment Service

Manages student course enrollments for the University Management System.

## API Endpoints

### Get All Enrollments
```
GET /api/enrollments
```

### Get Enrollment by ID
```
GET /api/enrollments/:id
```

### Get Enrollments by Student
```
GET /api/enrollments/student/:studentId
```

### Get Enrollments by Course
```
GET /api/enrollments/course/:courseId
```

### Create Enrollment
```
POST /api/enrollments
Content-Type: application/json

{
  "studentId": 1,
  "courseId": 1,
  "status": "active",
  "semester": "Fall 2024",
  "academicYear": "2024-2025"
}
```

**Note**: This endpoint validates that both the student and course exist by calling their respective services.

### Update Enrollment
```
PUT /api/enrollments/:id
Content-Type: application/json

{
  "status": "completed",
  "grade": "A"
}
```

### Delete Enrollment
```
DELETE /api/enrollments/:id
```

## Environment Variables

- `PORT` - Service port (default: 3004)
- `DATABASE_URL` - PostgreSQL connection string
- `STUDENT_SERVICE_URL` - Student service URL
- `COURSE_SERVICE_URL` - Course service URL
- `NODE_ENV` - Environment (development/production)

## Inter-Service Communication

This service communicates with:
- **Student Service**: Validates student existence
- **Course Service**: Validates course existence

## Running Locally

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Make sure Student and Course services are running before starting this service.
