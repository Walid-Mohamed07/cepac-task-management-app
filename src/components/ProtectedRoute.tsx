import type React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../lib/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "admin" | "employee";
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

  // Wrong role
  if (user.role.name !== requiredRole) {
    return (
      <Navigate
        to={user.role.name === "admin" ? "/admin" : "/employee"}
        replace
      />
    );
  }

  return <>{children}</>;
}
