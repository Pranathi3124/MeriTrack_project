
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import StudentProfile from "@/components/profile/StudentProfile";

const StudentProfilePage = () => {
  const { userData } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <StudentProfile userData={userData} />
    </div>
  );
};

export default StudentProfilePage;
