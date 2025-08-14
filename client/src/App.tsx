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
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={AdminDashboard} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/admin" component={AdminDashboard} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/dashboard" component={Dashboard} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/question-bank" component={QuestionBank} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/students" component={Students} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/attendance" component={Attendance} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/fees" component={Fees} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/mock-exams" component={MockExams} allowedRoles={["admin", "coordinator"]} />
      <ProtectedRoute path="/settings" component={Settings} allowedRoles={["admin", "coordinator"]} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="zerokelvin-theme">
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
