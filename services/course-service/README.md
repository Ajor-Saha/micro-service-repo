# Course Service

Manages course catalog for the University Management System.

## API Endpoints

### Get All Courses
```
GET /api/courses
```

### Get Course by ID
```
GET /api/courses/:id
```

### Create Course
```
POST /api/courses
Content-Type: application/json

{
  "courseCode": "CS101",
  "courseName": "Introduction to Computer Science",
  "description": "Fundamentals of programming and computer science",
  "credits": 3,
  "department": "Computer Science",
  "semester": "Fall 2024",
  "maxStudents": 30
}
```

### Update Course
```
PUT /api/courses/:id
Content-Type: application/json

{
  "maxStudents": 35,
  "semester": "Spring 2025"
}
```

### Delete Course
```
DELETE /api/courses/:id
```

## Environment Variables

- `PORT` - Service port (default: 3002)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

## Running Locally

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```
