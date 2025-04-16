
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell, Pie, PieChart } from "recharts";
import { Download, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAchievements } from "@/lib/firebase";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

const COLORS = ['#8B0000', '#B22222', '#CD5C5C', '#FF6347', '#FFA07A', '#E9967A'];

const ReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    branch: "",
    year: "",
    category: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });
  
  // Generated data based on achievements
  const [branchData, setBranchData] = useState<any[]>([]);
  const [yearData, setYearData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchAchievements();
  }, []);
  
  useEffect(() => {
    if (achievements.length > 0) {
      processData();
    }
  }, [achievements]);
  
  const fetchAchievements = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const achievementsData = await getAllAchievements(filters);
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements for reporting");
    } finally {
      setLoading(false);
    }
  };
  
  const processData = () => {
    // Process branch data
    const branchCounts: Record<string, number> = {};
    
    // Process year data
    const yearCounts: Record<string, number> = {};
    
    // Process category data
    const categoryCounts: Record<string, number> = {};
    
    // Process status data
    const statusCounts: Record<string, number> = {
      approved: 0,
      pending: 0,
      rejected: 0
    };
    
    achievements.forEach(achievement => {
      // Branch counts
      if (achievement.branch) {
        branchCounts[achievement.branch] = (branchCounts[achievement.branch] || 0) + 1;
      }
      
      // Year counts
      if (achievement.year) {
        yearCounts[achievement.year] = (yearCounts[achievement.year] || 0) + 1;
      }
      
      // Category counts
      if (achievement.category) {
        categoryCounts[achievement.category] = (categoryCounts[achievement.category] || 0) + 1;
      }
      
      // Status counts
      if (achievement.status) {
        statusCounts[achievement.status] = (statusCounts[achievement.status] || 0) + 1;
      }
    });
    
    // Convert to arrays for recharts
    const branchDataArray = Object.entries(branchCounts).map(([branch, count]) => ({
      name: branch,
      value: count,
    }));
    
    const yearDataArray = Object.entries(yearCounts).map(([year, count]) => ({
      name: `Year ${year}`,
      value: count,
    }));
    
    const categoryDataArray = Object.entries(categoryCounts).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
      value: count,
    }));
    
    const statusDataArray = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
    
    setBranchData(branchDataArray);
    setYearData(yearDataArray);
    setCategoryData(categoryDataArray);
    setStatusData(statusDataArray);
  };
  
  const handleFilterChange = (name: string, value: string | Date | undefined) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleApplyFilters = () => {
    fetchAchievements();
  };
  
  const handleResetFilters = () => {
    setFilters({
      branch: "",
      year: "",
      category: "",
      startDate: undefined,
      endDate: undefined
    });
    
    getAllAchievements({}).then((achievementsData) => {
      setAchievements(achievementsData);
    });
  };
  
  const downloadReport = () => {
    // Generate CSV data
    const csvRows = [];
    
    // Add headers
    csvRows.push([
      "Title", 
      "Category", 
      "Date", 
      "Status", 
      "Student Name", 
      "Roll No", 
      "Branch", 
      "Year"
    ].join(","));
    
    // Add row data
    achievements.forEach(achievement => {
      const date = achievement.date instanceof Date
        ? format(achievement.date, "yyyy-MM-dd")
        : format(achievement.date.toDate(), "yyyy-MM-dd");
      
      csvRows.push([
        `"${achievement.title.replace(/"/g, '""')}"`,
        `"${achievement.category}"`,
        `"${date}"`,
        `"${achievement.status}"`,
        `"${achievement.studentName || ''}"`,
        `"${achievement.rollNo || ''}"`,
        `"${achievement.branch || ''}"`,
        `"${achievement.year || ''}"`,
      ].join(","));
    });
    
    // Create CSV content
    const csvContent = csvRows.join("\r\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `achievement_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Achievement Reports</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
          
          <Button 
            onClick={downloadReport}
            className="bg-college-maroon hover:bg-college-darkmaroon"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-4 bg-white">
          <CardHeader className="pb-2">
            <CardTitle>Filter Reports</CardTitle>
            <CardDescription>Customize reports by applying filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select
                  value={filters.branch}
                  onValueChange={(value) => handleFilterChange("branch", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All branches</SelectItem>
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
                <Label>Year</Label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => handleFilterChange("year", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All years</SelectItem>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="internships">Internships</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="workshops">Workshops</SelectItem>
                    <SelectItem value="co-curricular">Co-curricular Activities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
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
                      {filters.startDate ? format(filters.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => handleFilterChange("startDate", date)}
                      initialFocus
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
                      {filters.endDate ? format(filters.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) => handleFilterChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="md:col-span-5 mt-2">
                <Button 
                  onClick={handleApplyFilters}
                  className="bg-college-maroon hover:bg-college-darkmaroon"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {loading ? (
          <div className="col-span-1 md:col-span-4 text-center py-12">
            <div className="w-12 h-12 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading report data...</p>
          </div>
        ) : (
          <>
            <Card className="md:col-span-2 bg-white">
              <CardHeader>
                <CardTitle>Achievements by Branch</CardTitle>
                <CardDescription>Distribution of achievements across departments</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8B0000" name="Achievements" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-white">
              <CardHeader>
                <CardTitle>Achievements by Year</CardTitle>
                <CardDescription>Distribution of achievements across academic years</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8B0000" name="Achievements" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-white">
              <CardHeader>
                <CardTitle>Achievements by Category</CardTitle>
                <CardDescription>Distribution of achievements by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8B0000"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} achievements`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-white">
              <CardHeader>
                <CardTitle>Achievements by Status</CardTitle>
                <CardDescription>Distribution of achievements by approval status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8B0000"
                      dataKey="value"
                    >
                      <Cell fill="#228B22" /> {/* Approved - Green */}
                      <Cell fill="#FFD700" /> {/* Pending - Yellow */}
                      <Cell fill="#DC143C" /> {/* Rejected - Red */}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} achievements`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-4 bg-white">
              <CardHeader>
                <CardTitle>Achievement Report Summary</CardTitle>
                <CardDescription>
                  Showing {achievements.length} achievements
                  {filters.branch ? ` for ${filters.branch} branch` : ""}
                  {filters.year ? ` in year ${filters.year}` : ""}
                  {filters.category ? ` in ${filters.category} category` : ""}
                  {filters.startDate ? ` from ${format(filters.startDate, "PPP")}` : ""}
                  {filters.endDate ? ` to ${format(filters.endDate, "PPP")}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {categoryData.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center mb-2">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <p className="text-sm font-medium">{item.name}</p>
                      </div>
                      <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
