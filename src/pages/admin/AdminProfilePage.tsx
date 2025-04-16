
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminProfile from "@/components/profile/AdminProfile";

const AdminProfilePage = () => {
  const { userData } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
      <AdminProfile userData={userData} />
    </div>
  );
};

export default AdminProfilePage;
