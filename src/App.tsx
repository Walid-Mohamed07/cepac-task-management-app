import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./lib/hooks";
import LoginPage from "./pages/login/page";
import AdminDashboard from "./pages/admin/page2";
import EmployeeDashboard from "./pages/employee/page";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import { logout } from "./lib/slices/authSlice";
// import type { User } from "./types";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    dispatch(logout());
    navigate("/login");
  };

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={
          user && isAuthenticated ? (
            <Navigate
              to={user.role.name === "admin" ? "/admin" : "/employee"}
            />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Protected admin route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Header userName={user?.name || "User"} onLogout={handleLogout} />
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected employee route */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="employee">
            <Header userName={user?.name || "User"} onLogout={handleLogout} />
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to login or dashboard based on auth */}
      <Route
        path="/"
        element={
          user && isAuthenticated ? (
            <Navigate
              to={user.role.name === "admin" ? "/admin" : "/employee"}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return <AppContent />;
}
