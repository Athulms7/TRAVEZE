import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vander-light">
        <div role="status" className="flex items-center gap-3 text-sm font-medium text-vander-teal">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-vander-teal/25 border-t-vander-teal" />
          Checking your sign-in...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
