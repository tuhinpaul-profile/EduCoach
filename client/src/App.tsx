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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/question-bank" component={QuestionBank} />
      <Route path="/students" component={Students} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/fees" component={Fees} />
      <Route path="/mock-exams" component={MockExams} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}


export default App;
