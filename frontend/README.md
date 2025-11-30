# University Management System - Frontend

A modern, responsive Next.js frontend for the University Management System microservices with rich UI powered by shadcn/ui.

## ✨ Features

- **Modern UI with shadcn/ui**: Professional component library with beautiful, accessible components
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices  
- **Rich Forms**: Complete CRUD operations with validation for all entities
- **Real-time Updates**: Automatic data refresh after create, update, and delete operations
- **Loading States**: Elegant loading indicators for better UX
- **Error Handling**: Comprehensive error messages and fallbacks
- **Type Safety**: Full TypeScript integration matching backend schemas
- **Icons**: Lucide React icons throughout the interface

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 📋 Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_STUDENT_API_URL=http://localhost:3001/api
NEXT_PUBLIC_COURSE_API_URL=http://localhost:3002/api
NEXT_PUBLIC_FACULTY_API_URL=http://localhost:3003/api
NEXT_PUBLIC_ENROLLMENT_API_URL=http://localhost:3004/api
```

## 🎯 Pages Overview

### Dashboard (`/`)
Central hub with cards for Students, Courses, Faculty, and Enrollments

### Students (`/students`)
- Create/Edit students with full profile information
- Fields: firstName, lastName, studentId, email, phone, dateOfBirth, address
- View enrollment date and all student details in table

### Courses (`/courses`)
- Manage course catalog with comprehensive details
- Fields: courseCode, courseName, description, credits, department, semester, maxStudents
- Badge display for credits

### Faculty (`/faculty`)
- Faculty member management with profiles
- Fields: firstName, lastName, employeeId, email, phone, department, designation, specialization, hireDate
- Badge display for designations

### Enrollments (`/enrollments`)
- Enroll students in courses with status tracking
- Fields: studentId, courseId, status (active/completed/dropped), grade, semester, academicYear
- Shows student names and course details from related services
- Color-coded status badges

## 🎨 UI Components

### Forms
All forms are modal dialogs with:
- Validation
- Loading states
- Error handling
- Required field indicators
- Placeholder text
- Proper input types (email, tel, date, number)

### Tables
- Responsive with horizontal scroll
- Sortable headers
- Action buttons (Edit, Delete)
- Empty states with call-to-action
- Loading spinners

### Cards
- Hover effects
- Color-coded borders (blue/green/purple/orange)
- Icons from lucide-react
- Consistent spacing

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **lucide-react** - Icons
- **React 19** - Latest React

## 📦 Key Dependencies

```json
{
  "next": "16.0.5",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4.0.0",
  "lucide-react": "latest"
}
```

## 🔌 API Integration

### API Client (`lib/api.ts`)

Each service exposes full CRUD:

```typescript
studentApi.getAll()      // GET /api/students
studentApi.getById(id)   // GET /api/students/:id
studentApi.create(data)  // POST /api/students
studentApi.update(id, data) // PUT /api/students/:id
studentApi.delete(id)    // DELETE /api/students/:id
```

Same pattern for `courseApi`, `facultyApi`, `enrollmentApi`

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── students/page.tsx          # Students CRUD
│   ├── courses/page.tsx           # Courses CRUD  
│   ├── faculty/page.tsx           # Faculty CRUD
│   └── enrollments/page.tsx       # Enrollments CRUD
├── components/
│   ├── forms/
│   │   ├── StudentForm.tsx
│   │   ├── CourseForm.tsx
│   │   ├── FacultyForm.tsx
│   │   └── EnrollmentForm.tsx
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── api.ts                     # API client
│   └── utils.ts                   # Utilities
└── types/
    └── index.ts                   # TypeScript types
```

## 🎨 Customization

### Adding shadcn Components

```bash
npx shadcn@latest add [component]
```

### Theme Customization

Edit `app/globals.css` for colors and `tailwind.config.ts` for theme tokens.

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

```bash
npm run build
npm start
```

## 🔍 Development Tips

### Type Safety
All API responses are fully typed to match backend Drizzle schemas

### Form Validation
Forms validate on submit, showing specific error messages

### Error Handling
Network errors show user-friendly messages with retry options

### Empty States
Each page has helpful empty states encouraging first actions

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

1. Match existing code style
2. Use TypeScript types
3. Add error handling
4. Test all CRUD operations
5. Ensure mobile responsiveness

---

Built with ❤️ using Next.js and shadcn/ui
