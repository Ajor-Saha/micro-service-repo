# Faculty Service

Manages faculty members for the University Management System.

## API Endpoints

### Get All Faculty
```
GET /api/faculty
```

### Get Faculty by ID
```
GET /api/faculty/:id
```

### Create Faculty
```
POST /api/faculty
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@university.edu",
  "phone": "+1234567890",
  "employeeId": "FAC001",
  "department": "Computer Science",
  "designation": "Associate Professor",
  "specialization": "Machine Learning and AI",
  "hireDate": "2015-08-15"
}
```

### Update Faculty
```
PUT /api/faculty/:id
Content-Type: application/json

{
  "designation": "Professor",
  "department": "Data Science"
}
```

### Delete Faculty
```
DELETE /api/faculty/:id
```

## Environment Variables

- `PORT` - Service port (default: 3003)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

## Running Locally

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```
