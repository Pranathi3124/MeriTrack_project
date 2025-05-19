import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import StudentProfile from "@/components/profile/StudentProfile";
import StudentStats from "@/components/profile/StudentStats";
import { getUserAchievements } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ChartPie } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const StudentProfilePage = () => {
  const { userData, user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAchievements = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const userAchievements = await getUserAchievements(user.uid);
          setAchievements(userAchievements);
        } catch (error) {
          console.error("Error fetching achievements:", error);
          toast.error("Failed to load achievements");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAchievements();
  }, [user]);
  
  return (
    <motion.div 
      className="container mx-auto py-8 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-college-gray">My Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile Details
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <ChartPie className="mr-2 h-4 w-4" />
            My Statistics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-0">
          <StudentProfile userData={userData} />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-maroon"></div>
            </div>
          ) : (
            <StudentStats achievements={achievements} />
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default StudentProfilePage;
