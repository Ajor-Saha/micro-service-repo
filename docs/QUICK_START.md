# 🚀 Quick Start Guide - Running Your Complete System

## Prerequisites
- Docker Desktop running
- Node.js 18+ installed
- All dependencies installed

## Step-by-Step Startup

### 1. Start Databases (Terminal 1)
```bash
# From project root
docker-compose up
```
Wait for all 4 PostgreSQL databases to be ready (ports 5441-5444)

### 2. Start Student Service (Terminal 2)
```bash
npm run dev:student
```
Service running on: http://localhost:3001

### 3. Start Course Service (Terminal 3)
```bash
npm run dev:course
```
Service running on: http://localhost:3002

### 4. Start Faculty Service (Terminal 4)
```bash
npm run dev:faculty
```
Service running on: http://localhost:3003

### 5. Start Enrollment Service (Terminal 5)
```bash
npm run dev:enrollment
```
Service running on: http://localhost:3004

### 6. Start Frontend (Terminal 6)
```bash
cd frontend
npm run dev
```
Frontend running on: http://localhost:3000

## 🎯 Access Points

### Frontend
- **Dashboard**: http://localhost:3000
- **Students**: http://localhost:3000/students
- **Courses**: http://localhost:3000/courses
- **Faculty**: http://localhost:3000/faculty
- **Enrollments**: http://localhost:3000/enrollments

### Backend APIs
- **Student API**: http://localhost:3001/api/students
- **Course API**: http://localhost:3002/api/courses
- **Faculty API**: http://localhost:3003/api/faculty
- **Enrollment API**: http://localhost:3004/api/enrollments

### Health Checks
- http://localhost:3001/health
- http://localhost:3002/health
- http://localhost:3003/health
- http://localhost:3004/health

## 📊 Database Access

### Using Docker
```bash
# Student DB (port 5441)
docker exec -it preli-demo-student-db-1 psql -U postgres -d student_db

# Course DB (port 5442)
docker exec -it preli-demo-course-db-1 psql -U postgres -d course_db

# Faculty DB (port 5443)
docker exec -it preli-demo-faculty-db-1 psql -U postgres -d faculty_db

# Enrollment DB (port 5444)
docker exec -it preli-demo-enrollment-db-1 psql -U postgres -d enrollment_db
```

### Using Drizzle Studio
```bash
# In each service directory
npm run db:studio

# Opens visual database editor at:
# Student: https://local.drizzle.studio/?port=5441
# Course: https://local.drizzle.studio/?port=5442
# Faculty: https://local.drizzle.studio/?port=5443
# Enrollment: https://local.drizzle.studio/?port=5444
```

## 🧪 Testing the System

### 1. Create a Student
1. Go to http://localhost:3000/students
2. Click "Add New Student"
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Student ID: STU2024001
   - Email: john.doe@university.edu
   - Phone: +1 (555) 123-4567
4. Click "Create Student"

### 2. Create a Course
1. Go to http://localhost:3000/courses
2. Click "Add New Course"
3. Fill in the form:
   - Course Code: CS101
   - Course Name: Introduction to Computer Science
   - Credits: 3
   - Department: Computer Science
   - Semester: Fall 2024
4. Click "Create Course"

### 3. Create a Faculty Member
1. Go to http://localhost:3000/faculty
2. Click "Add New Faculty"
3. Fill in the form:
   - First Name: Dr. Jane
   - Last Name: Smith
   - Employee ID: EMP2024001
   - Email: jane.smith@university.edu
   - Designation: Professor
   - Department: Computer Science
4. Click "Create Faculty"

### 4. Create an Enrollment
1. Go to http://localhost:3000/enrollments
2. Click "Add New Enrollment"
3. Select:
   - Student: John Doe (STU2024001)
   - Course: CS101 - Introduction to Computer Science
   - Status: Active
   - Semester: Fall 2024
   - Academic Year: 2024-2025
4. Click "Create Enrollment"

### 5. Test Edit and Delete
- Click "Edit" on any row to modify data
- Click "Delete" to remove (with confirmation)

## 🔧 Troubleshooting

### Databases Not Starting
```bash
# Stop and remove containers
docker-compose down

# Start fresh
docker-compose up
```

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### API Not Connecting
1. Check all services are running (check health endpoints)
2. Verify environment variables in `frontend/.env.local`
3. Check browser console for CORS errors
4. Ensure no firewall blocking local connections

### Frontend Not Loading
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

### Database Connection Errors
1. Verify Docker containers are running: `docker ps`
2. Check .env files in each service directory
3. Ensure database ports (5441-5444) are not in use
4. Try restarting Docker Desktop

## 📝 Common Commands

### Stop Everything
```bash
# Stop Docker
docker-compose down

# Stop all services: Ctrl+C in each terminal
```

### View Logs
```bash
# Docker logs
docker-compose logs -f

# Service logs: Check the terminal where service is running
```

### Reset Databases
```bash
# Stop and remove volumes
docker-compose down -v

# Start fresh
docker-compose up

# Run migrations again in each service
cd services/student-service
npm run db:push
```

## 🎨 Features to Try

1. **Create Multiple Records**: Add several students, courses, and faculty
2. **Edit Records**: Update student information, change course details
3. **View Enrollments**: See students enrolled in courses with status
4. **Delete Records**: Remove students, courses (enrollments will be orphaned)
5. **Empty States**: Delete all records to see empty state messages
6. **Responsive Design**: Resize browser to see mobile view

## 📱 Mobile Testing

1. Open http://localhost:3000 on your phone (same network)
2. Or use browser dev tools:
   - Chrome: F12 → Toggle device toolbar
   - Firefox: F12 → Responsive design mode

## ✅ Success Indicators

Your system is working correctly if:
- ✅ All 4 health endpoints return status
- ✅ Frontend dashboard loads without errors
- ✅ Can create students, courses, faculty
- ✅ Can create enrollments with dropdowns populated
- ✅ Edit forms pre-populate with current data
- ✅ Delete operations work with confirmation
- ✅ Tables display all data correctly
- ✅ Status badges show correct colors
- ✅ Loading states appear during operations

## 🎉 You're Ready!

Your microservices-based University Management System is now running with:
- 4 independent backend services
- 4 separate PostgreSQL databases
- 1 modern Next.js frontend
- Complete CRUD operations
- Rich UI with shadcn/ui components

Happy developing! 🚀
