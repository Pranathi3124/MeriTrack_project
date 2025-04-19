
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAchievements } from "@/lib/firebase";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AchievementReviewCard from "@/components/faculty/AchievementReviewCard";
import AchievementStats from "@/components/faculty/AchievementStats";
import { Book, Trophy, Award, CheckCircle, XCircle, Clock, Filter, RefreshCcw, CalendarIcon, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

// Define the Achievement type to fix the error
type Achievement = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: Date | any;
  documentURL?: string;
  documentName?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
  studentName: string;
  studentEmail: string;
  rollNo: string;
  branch: string;
  year: string;
  userId: string;
};

const FacultyDashboardPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: "all",
    year: "all",
    category: "all",
    rollNo: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });
  const [activeTab, setActiveTab] = useState("pending");
  
  const fetchAchievements = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const achievementsData = await getAllAchievements(filters);
      // Explicitly cast the returned data to the Achievement type
      setAchievements(achievementsData as Achievement[]);
      
      // Show notification if there are pending achievements
      const pendingCount = achievementsData.filter(a => a.status === "pending").length;
      if (pendingCount > 0 && activeTab !== "pending") {
        toast.info(`You have ${pendingCount} pending achievement${pendingCount === 1 ? '' : 's'} to review.`, {
          action: {
            label: "View",
            onClick: () => setActiveTab("pending")
          }
        });
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAchievements();
    
    // Refresh achievements data every 5 minutes
    const intervalId = setInterval(() => {
      fetchAchievements();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  const handleFilterChange = (name: string, value: string | Date | undefined) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleApplyFilters = () => {
    fetchAchievements();
  };
  
  const handleResetFilters = () => {
    setFilters({
      branch: "all",
      year: "all",
      category: "all",
      rollNo: "",
      startDate: undefined,
      endDate: undefined
    });
    
    fetchAchievements();
  };
  
  const pendingAchievements = achievements.filter(
    (achievement) => achievement.status === "pending"
  );
  
  const approvedAchievements = achievements.filter(
    (achievement) => achievement.status === "approved"
  );
  
  const rejectedAchievements = achievements.filter(
    (achievement) => achievement.status === "rejected"
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>
      
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Total Submissions</p>
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
        
        <div className="bg-white rounded-lg shadow p-6 relative">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-bold">{pendingAchievements.length}</h2>
            </div>
          </div>
          {pendingAchievements.length > 0 && (
            <span className="absolute top-3 right-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="pending" className="relative">
            Pending ({pendingAchievements.length})
            {pendingAchievements.length > 0 && (
              <span className="absolute top-0 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedAchievements.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedAchievements.length})</TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 className="h-4 w-4 mr-1" />
            Statistics
          </TabsTrigger>
        </TabsList>
        
        <div className="grid md:grid-cols-5 gap-6">
          <div className={`md:col-span-${activeTab === "statistics" ? "5" : "2"} ${activeTab !== "statistics" ? "block" : "hidden"}`}>
            <Card>
              <CardHeader>
                <CardTitle>Filter Achievements</CardTitle>
                <CardDescription>Filter students' achievements by various parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll Number</Label>
                  <Input
                    id="rollNo"
                    value={filters.rollNo}
                    onChange={(e) => handleFilterChange("rollNo", e.target.value)}
                    placeholder="Enter roll number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    value={filters.branch}
                    onValueChange={(value) => handleFilterChange("branch", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All branches</SelectItem>
                      <SelectItem value="CSE">Computer Science</SelectItem>
                      <SelectItem value="IT">Information Technology</SelectItem>
                      <SelectItem value="ECE">Electronics & Communication</SelectItem>
                      <SelectItem value="EEE">Electrical & Electronics</SelectItem>
                      <SelectItem value="MECH">Mechanical</SelectItem>
                      <SelectItem value="CIVIL">Civil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={filters.year}
                    onValueChange={(value) => handleFilterChange("year", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All years</SelectItem>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="internships">Internships</SelectItem>
                      <SelectItem value="hackathon">Hackathon</SelectItem>
                      <SelectItem value="workshops">Workshops</SelectItem>
                      <SelectItem value="co-curricular">Co-curricular Activities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.startDate ? format(filters.startDate, "PPP") : "Pick start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.startDate}
                          onSelect={(date) => handleFilterChange("startDate", date)}
                          initialFocus
                          fromDate={new Date(2020, 0, 1)}
                          toDate={new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.endDate ? format(filters.endDate, "PPP") : "Pick end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.endDate}
                          onSelect={(date) => handleFilterChange("endDate", date)}
                          initialFocus
                          fromDate={filters.startDate || new Date(2020, 0, 1)}
                          toDate={new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  className="w-full bg-college-maroon hover:bg-college-darkmaroon"
                  onClick={handleApplyFilters}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleResetFilters}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className={`md:col-span-${activeTab === "statistics" ? "5" : "3"} ${activeTab === "statistics" ? "block" : activeTab === "pending" || activeTab === "approved" || activeTab === "rejected" ? "block" : "hidden"}`}>
            {activeTab === "statistics" ? (
              <AchievementStats achievements={achievements} />
            ) : activeTab === "pending" ? (
              loading ? (
                <div className="text-center p-8">
                  <div className="w-10 h-10 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4">Loading achievements...</p>
                </div>
              ) : pendingAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {pendingAchievements.map((achievement) => (
                    <AchievementReviewCard 
                      key={achievement.id} 
                      achievement={achievement}
                      onStatusUpdate={fetchAchievements}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No pending achievements</h3>
                  <p className="text-gray-500">
                    All achievements have been reviewed.
                  </p>
                </div>
              )
            ) : activeTab === "approved" ? (
              loading ? (
                <div className="text-center p-8">
                  <div className="w-10 h-10 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4">Loading achievements...</p>
                </div>
              ) : approvedAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {approvedAchievements.map((achievement) => (
                    <AchievementReviewCard 
                      key={achievement.id} 
                      achievement={achievement} 
                      onStatusUpdate={fetchAchievements}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No approved achievements</h3>
                  <p className="text-gray-500">
                    You haven't approved any achievements yet.
                  </p>
                </div>
              )
            ) : activeTab === "rejected" ? (
              loading ? (
                <div className="text-center p-8">
                  <div className="w-10 h-10 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4">Loading achievements...</p>
                </div>
              ) : rejectedAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {rejectedAchievements.map((achievement) => (
                    <AchievementReviewCard 
                      key={achievement.id} 
                      achievement={achievement} 
                      onStatusUpdate={fetchAchievements}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No rejected achievements</h3>
                  <p className="text-gray-500">
                    You haven't rejected any achievements.
                  </p>
                </div>
              )
            ) : null}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default FacultyDashboardPage;
