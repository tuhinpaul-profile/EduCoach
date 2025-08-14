import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import QuestionBank from "@/pages/question-bank";
import Students from "@/pages/students";
import Attendance from "@/pages/attendance";
import Fees from "@/pages/fees";
import MockExams from "@/pages/mock-exams";
import Settings from "@/pages/settings";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import TeacherDashboard from "@/pages/teacher-dashboard";
import StudentDashboard from "@/pages/student-dashboard";
import ParentDashboard from "@/pages/parent-dashboard";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/lib/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      {/* Admin & Coordinator Routes */}
      <ProtectedRoute path="/" component={Dashboard} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/admin" component={Dashboard} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/dashboard" component={Dashboard} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/question-bank" component={QuestionBank} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/students" component={Students} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/attendance" component={Attendance} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/fees" component={Fees} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/mock-exams" component={MockExams} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/settings" component={Settings} allowedRoles={["admin", "coordinator"]} />
      
      {/* Role-specific Dashboards */}
      <ProtectedRoute path="/teacher" component={TeacherDashboard} allowedRoles={["teacher"]} />
      <ProtectedRoute path="/student" component={StudentDashboard} allowedRoles={["student"]} />
      <ProtectedRoute path="/parent" component={ParentDashboard} allowedRoles={["parent"]} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="educonnect-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}


export default App;
