import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            University Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Microservices-based Student, Course, Faculty & Enrollment Management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Students Card */}
          <Link href="/students" className="block">
            <Card className="hover:shadow-xl transition-shadow border-t-4 border-blue-500 cursor-pointer">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">Students</CardTitle>
                <CardDescription>Manage student records and information</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Courses Card */}
          <Link href="/courses" className="block">
            <Card className="hover:shadow-xl transition-shadow border-t-4 border-green-500 cursor-pointer">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">Courses</CardTitle>
                <CardDescription>Manage course catalog and details</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Faculty Card */}
          <Link href="/faculty" className="block">
            <Card className="hover:shadow-xl transition-shadow border-t-4 border-purple-500 cursor-pointer">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">Faculty</CardTitle>
                <CardDescription>Manage faculty members and staff</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Enrollments Card */}
          <Link href="/enrollments" className="block">
            <Card className="hover:shadow-xl transition-shadow border-t-4 border-orange-500 cursor-pointer">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 mx-auto">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">Enrollments</CardTitle>
                <CardDescription>Manage student course enrollments</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <Card className="inline-block w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">System Status</CardTitle>
              <CardDescription className="flex items-center justify-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  All services running
                </Badge>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
