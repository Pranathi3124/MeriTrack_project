
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

interface AppLayoutProps {
  requiredRole?: "student" | "faculty" | "admin";
}

const AppLayout: React.FC<AppLayoutProps> = ({ requiredRole }) => {
  const { loading, user, userData } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login with return URL
  if (!user) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If role is required but user doesn't have the role, redirect based on their actual role
  if (requiredRole && userData?.role !== requiredRole) {
    switch (userData?.role) {
      case "student":
        return <Navigate to="/student/dashboard" replace />;
      case "faculty":
        return <Navigate to="/faculty/dashboard" replace />;
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <footer className="py-6 bg-gray-800 text-white">
        <div className="container mx-auto text-center px-4">
          <p>© {new Date().getFullYear()} MeriTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
