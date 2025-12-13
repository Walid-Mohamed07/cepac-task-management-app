import type React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../lib/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "employee" | ("admin" | "employee")[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, token } = useAppSelector((state) => state.auth);

  // Not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (requiredRole) {
    const userRole = user.role?.name;
    if (!userRole) {
      // User has no role, but a role is required.
      return <Navigate to="/login" replace />;
    }

    const isAuthorized = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!isAuthorized) {
      return (
        <Navigate
          to={userRole === "admin" ? "/admin" : "/employee"}
          replace
        />
      );
    }
  }

  return <>{children}</>;
}
