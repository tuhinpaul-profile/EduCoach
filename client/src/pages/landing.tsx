import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, GraduationCap, MessageSquare, TrendingUp, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
            EduConnect
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/auth">
            <Button data-testid="button-login" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <Badge data-testid="badge-status" className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200 border-0">
            All-in-One Education Management Platform
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Transforming Education
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Management
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            EduConnect streamlines educational institutions with comprehensive tools for student management, 
            attendance tracking, fee collection, question bank creation, and seamless communication between 
            administrators, teachers, students, and parents.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/auth">
              <Button data-testid="button-demo" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                <Zap className="mr-2 w-5 h-5" />
                Start Demo
              </Button>
            </Link>
            <Button data-testid="button-learn-more" variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card data-testid="card-feature-management" className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Student Management</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Complete student lifecycle management with detailed profiles, parent/guardian integration, batch assignments, academic history tracking, and bulk import/export capabilities for efficient enrollment processes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-questions" className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Question Bank</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Advanced question management with AI-powered document parsing, 11+ question types including Matrix Match and Comprehensions, hierarchical Subject→Chapter→Topic organization, and bulk upload capabilities for efficient content creation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-communication" className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Smart Communication</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Comprehensive communication hub with real-time messaging, rich text editor, role-based recipient filtering, broadcast announcements, notification management, and seamless parent-teacher-student communication channels.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-attendance" className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Attendance Tracking</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Digital attendance system replacing traditional registers with real-time marking, batch-wise tracking, multiple status types (Present/Absent/Late), automated parent notifications, and comprehensive analytics with trend analysis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-fees" className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Fee Management</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Complete financial management system with flexible fee structures, multiple payment methods (Cash/Card/UPI/Bank Transfer), automated receipt generation, overdue tracking, late fee calculations, and comprehensive financial reporting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-analytics" className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Analytics & Reports</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Advanced analytics dashboard with real-time statistics, performance tracking, attendance trends, financial insights, student progress monitoring, and customizable reports with PDF/Excel export capabilities for data-driven decisions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Role-Based Access Demo */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Experience Different Perspectives
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore tailored dashboards designed for each user role in the education ecosystem
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            <div data-testid="role-admin" className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700">
              <div className="text-2xl mb-2">👨‍💼</div>
              <h4 className="font-semibold text-red-800 dark:text-red-200">Admin</h4>
              <p className="text-sm text-red-600 dark:text-red-300">Full Control</p>
            </div>
            
            <div data-testid="role-teacher" className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
              <div className="text-2xl mb-2">👩‍🏫</div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Teacher</h4>
              <p className="text-sm text-blue-600 dark:text-blue-300">Classroom Focus</p>
            </div>
            
            <div data-testid="role-student" className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
              <div className="text-2xl mb-2">🎓</div>
              <h4 className="font-semibold text-green-800 dark:text-green-200">Student</h4>
              <p className="text-sm text-green-600 dark:text-green-300">Learning Hub</p>
            </div>
            
            <div data-testid="role-parent" className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700">
              <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Parent</h4>
              <p className="text-sm text-purple-600 dark:text-purple-300">Child Progress</p>
            </div>
            
            <div data-testid="role-coordinator" className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Coordinator</h4>
              <p className="text-sm text-orange-600 dark:text-orange-300">Operations</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Institution?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of educators who trust EduConnect for their management needs
          </p>
          <Link href="/auth">
            <Button data-testid="button-get-started" size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3">
              <Zap className="mr-2 w-5 h-5" />
              Get Started Today
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 dark:text-gray-400">
        <p>&copy; 2025 EduConnect. Empowering education through technology.</p>
      </footer>
    </div>
  );
}