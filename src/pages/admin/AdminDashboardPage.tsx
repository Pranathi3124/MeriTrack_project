
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import { UserType } from "lucide-react";

const AdminDashboardPage = () => {
  const { userData } = useAuth();
  const [role, setRole] = useState<"student" | "faculty" | "admin">("student");
  
  const handleRoleChange = (value: string) => {
    setRole(value as "student" | "faculty" | "admin");
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="student" onValueChange={handleRoleChange}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="admin">Administrators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="student" className="mt-0">
          <UserManagement role="student" />
        </TabsContent>
        
        <TabsContent value="faculty" className="mt-0">
          <UserManagement role="faculty" />
        </TabsContent>
        
        <TabsContent value="admin" className="mt-0">
          <UserManagement role="admin" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
