
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

const Index = () => {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user && userData) {
        // Redirect based on role
        switch (userData.role) {
          case "student":
            navigate("/student/dashboard");
            break;
          case "faculty":
            navigate("/faculty/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/login");
        }
      } else {
        // Not authenticated
        navigate("/landing");
      }
    }
  }, [user, userData, loading, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader className="h-8 w-8 animate-spin mx-auto text-college-maroon" />
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
