# Student Service

Manages student information for the University Management System.

## API Endpoints

### Get All Students
```
GET /api/students
```

### Get Student by ID
```
GET /api/students/:id
```

### Create Student
```
POST /api/students
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "phone": "+1234567890",
  "studentId": "STU001",
  "dateOfBirth": "2000-01-15",
  "address": "123 Main St, City, State"
}
```

### Update Student
```
PUT /api/students/:id
Content-Type: application/json

{
  "email": "newemail@university.edu",
  "phone": "+0987654321"
}
```

### Delete Student
```
DELETE /api/students/:id
```

## Environment Variables

- `PORT` - Service port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

## Running Locally

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```
