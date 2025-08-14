import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/auth" />;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          // Instead of showing access denied, redirect to appropriate role-based dashboard
          const roleRoutes = {
            admin: "/dashboard",
            coordinator: "/dashboard", 
            teacher: "/teacher",
            student: "/student",
            parent: "/parent"
          };
          
          const targetRoute = roleRoutes[user.role as keyof typeof roleRoutes] || "/auth";
          return <Redirect to={targetRoute} />;
        }

        return <Component {...params} />;
      }}
    </Route>
  );
}