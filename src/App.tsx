import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./lib/hooks";
import LoginPage from "./pages/login/page";
import AdminDashboard from "./pages/admin/page2";
import EmployeeDashboard from "./pages/employee/page";
import MessengerPage from "./pages/messenger/page";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

function AppContent() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={user.role?.name === "admin" ? "/admin" : "/employee"}
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
            <Header />
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected employee route */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="employee">
            <Header />
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected messenger route */}
      <Route
        path="/messenger"
        element={
          <ProtectedRoute requiredRole={["admin", "employee"]}>
            <Header />
            <MessengerPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to login or dashboard based on auth */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={user.role?.name === "admin" ? "/admin" : "/employee"}
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
