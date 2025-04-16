
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medal, Award, TrendingUp, Clipboard, PlusCircle } from "lucide-react";
import { getUserAchievements } from "@/lib/firebase";
import AchievementCard from "@/components/achievements/AchievementCard";
import AchievementForm from "@/components/achievements/AchievementForm";

const StudentDashboardPage = () => {
  const { user, userData } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAchievementForm, setShowAchievementForm] = useState(false);

  const fetchAchievements = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const achievementsData = await getUserAchievements(user.uid);
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  const getStatusCount = (status: string) => {
    return achievements.filter(achievement => achievement.status === status).length;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-college-gray">Student Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {userData?.name || "Student"}
          </p>
        </div>
        <Button 
          onClick={() => setShowAchievementForm(true)} 
          className="mt-4 md:mt-0 bg-college-maroon hover:bg-college-darkmaroon"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Achievement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground">Your submitted achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("approved")}</div>
            <p className="text-xs text-muted-foreground">Verified achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clipboard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("pending")}</div>
            <p className="text-xs text-muted-foreground">Waiting for verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievements.length > 0 
                ? Math.round((getStatusCount("approved") / achievements.length) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Approval rate</p>
          </CardContent>
        </Card>
      </div>

      {showAchievementForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Achievement</CardTitle>
            <CardDescription>Fill in the details of your achievement</CardDescription>
          </CardHeader>
          <CardContent>
            <AchievementForm />
          </CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
          <TabsTrigger value="hackathon">Hackathons</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="co-curricular">Co-Curricular</TabsTrigger>
        </TabsList>
        
        {["all", "academic", "sports", "internships", "hackathon", "workshops", "co-curricular"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {isLoading ? (
              <p>Loading achievements...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements
                  .filter(achievement => category === "all" || achievement.category === category)
                  .map((achievement) => (
                    <AchievementCard 
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
              </div>
            )}
            
            {!isLoading && 
              achievements.filter(achievement => category === "all" || achievement.category === category).length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="mb-4 text-gray-500">No achievements found in this category</p>
                  <Button 
                    onClick={() => setShowAchievementForm(true)} 
                    variant="outline"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Achievement
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StudentDashboardPage;
