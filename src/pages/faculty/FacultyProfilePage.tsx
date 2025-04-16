
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import FacultyProfile from "@/components/profile/FacultyProfile";

const FacultyProfilePage = () => {
  const { userData } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Faculty Profile</h1>
      <FacultyProfile userData={userData} />
    </div>
  );
};

export default FacultyProfilePage;
