
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserAchievements } from "@/lib/firebase";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementForm from "@/components/achievements/AchievementForm";
import AchievementCard from "@/components/achievements/AchievementCard";
import { Book, Trophy, Award, CheckCircle, XCircle, Clock } from "lucide-react";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      
      try {
        const achievements = await getUserAchievements(user.uid);
        setAchievements(achievements);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        toast.error("Failed to load achievements");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user]);
  
  const pendingAchievements = achievements.filter(
    (achievement) => achievement.status === "pending"
  );
  
  const approvedAchievements = achievements.filter(
    (achievement) => achievement.status === "approved"
  );
  
  const rejectedAchievements = achievements.filter(
    (achievement) => achievement.status === "rejected"
  );
  
  // Count achievements by category
  const categoryCounts = achievements.reduce((acc: Record<string, number>, achievement) => {
    const category = achievement.category;
    if (category) {
      acc[category] = (acc[category] || 0) + 1;
    }
    return acc;
  }, {});
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Total Achievements</p>
              <h2 className="text-3xl font-bold">{achievements.length}</h2>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Approved</p>
              <h2 className="text-3xl font-bold">{approvedAchievements.length}</h2>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-bold">{pendingAchievements.length}</h2>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Rejected</p>
              <h2 className="text-3xl font-bold">{rejectedAchievements.length}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <div key={category} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-college-maroon p-4 rounded-full">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </p>
                <h2 className="text-2xl font-bold">{count}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <AchievementForm />
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {loading ? (
                <div className="text-center p-8">
                  <div className="w-10 h-10 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4">Loading achievements...</p>
                </div>
              ) : achievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No achievements yet</h3>
                  <p className="text-gray-500">
                    Add your first achievement using the form.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {pendingAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {pendingAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No pending achievements</h3>
                  <p className="text-gray-500">
                    All of your submissions have been reviewed.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="approved" className="mt-0">
              {approvedAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {approvedAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No approved achievements</h3>
                  <p className="text-gray-500">
                    Your submissions are waiting for faculty approval.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-0">
              {rejectedAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {rejectedAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No rejected achievements</h3>
                  <p className="text-gray-500">
                    You don't have any rejected submissions.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
