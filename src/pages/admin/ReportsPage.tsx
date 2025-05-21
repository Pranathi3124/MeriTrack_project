
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Download, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAchievements } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";
import AchievementAnalytics from "@/components/analytics/AchievementAnalytics";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    branch: "",
    year: "",
    category: "",
    level: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });
  
  useEffect(() => {
    fetchAchievements();
  }, []);
  
  const fetchAchievements = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const achievementsData = await getAllAchievements(filters);
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast({
        title: "Failed to load achievements for reporting",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      level: "",
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
      "Level", 
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
        `"${achievement.level || 'N/A'}"`,
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
      
      <div className="space-y-6">
        <Card className="bg-white">
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
                    <SelectItem value="academic">Academic Excellence</SelectItem>
                    <SelectItem value="technical">Technical Skills</SelectItem>
                    <SelectItem value="research">Research & Projects</SelectItem>
                    <SelectItem value="competition">Competitions</SelectItem>
                    <SelectItem value="extra-curricular">Extra-Curricular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={filters.level}
                  onValueChange={(value) => handleFilterChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All levels</SelectItem>
                    <SelectItem value="college">College Level</SelectItem>
                    <SelectItem value="state">State/Regional Level</SelectItem>
                    <SelectItem value="national">National Level</SelectItem>
                    <SelectItem value="international">International Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex gap-2">
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
                        {filters.startDate ? format(filters.startDate, "PPP") : "Start date"}
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
                        {filters.endDate ? format(filters.endDate, "PPP") : "End date"}
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
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading report data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AchievementAnalytics achievements={achievements} />
            
            {/* Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle>Summary Table</CardTitle>
                <CardDescription>
                  Detailed view of {achievements.length} achievements
                  {filters.branch ? ` for ${filters.branch} branch` : ""}
                  {filters.year ? ` in year ${filters.year}` : ""}
                  {filters.category ? ` in ${filters.category} category` : ""}
                  {filters.level ? ` at ${filters.level} level` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of achievements based on applied filters</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {achievements.slice(0, 10).map((achievement) => (
                        <TableRow key={achievement.id}>
                          <TableCell className="font-medium">{achievement.studentName}</TableCell>
                          <TableCell>{achievement.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {achievement.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {achievement.level || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>{achievement.branch}</TableCell>
                          <TableCell>{achievement.year}</TableCell>
                          <TableCell>
                            <Badge 
                              className={cn(
                                achievement.status === "approved" && "bg-green-100 text-green-800",
                                achievement.status === "pending" && "bg-yellow-100 text-yellow-800",
                                achievement.status === "rejected" && "bg-red-100 text-red-800"
                              )}
                            >
                              {achievement.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {achievements.length > 10 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            Showing 10 of {achievements.length} results. Download the CSV for full data.
                          </TableCell>
                        </TableRow>
                      )}
                      {achievements.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No achievements found matching the filter criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
