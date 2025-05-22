import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Download, Calendar as CalendarIcon, Filter, FileBarChart2, BarChart3, PieChart } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAchievements } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import AchievementAnalytics from "@/components/analytics/AchievementAnalytics";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const ReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    branch: "all",
    year: "all",
    category: "all",
    level: "all",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });
  
  // NAAC and NBA specific metrics
  const [naacMetrics, setNaacMetrics] = useState({
    totalResearchPublications: 0,
    internationalConferences: 0,
    nationalConferences: 0,
    patents: 0,
    industryCollaborations: 0
  });
  
  const [nbaMetrics, setNbaMetrics] = useState({
    programOutcomes: 0,
    courseOutcomes: 0,
    studentPlacement: 0,
    higherEducation: 0,
    entrepreneurship: 0
  });
  
  useEffect(() => {
    fetchAchievements();
  }, []);
  
  const fetchAchievements = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Convert "all" filter values to empty strings for the backend
      const apiFilters = {
        ...filters,
        branch: filters.branch === "all" ? "" : filters.branch,
        year: filters.year === "all" ? "" : filters.year,
        category: filters.category === "all" ? "" : filters.category,
        level: filters.level === "all" ? "" : filters.level,
      };
      
      const achievementsData = await getAllAchievements(apiFilters);
      setAchievements(achievementsData);
      
      // Calculate NAAC and NBA metrics
      calculateAccreditationMetrics(achievementsData);
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
  
  const calculateAccreditationMetrics = (data: any[]) => {
    // NAAC metrics
    const naac = {
      totalResearchPublications: data.filter(a => a.category === 'research' || a.title?.toLowerCase().includes('research') || a.title?.toLowerCase().includes('publication')).length,
      internationalConferences: data.filter(a => a.level === 'international' && a.category !== 'internships').length,
      nationalConferences: data.filter(a => a.level === 'national').length,
      patents: data.filter(a => a.title?.toLowerCase().includes('patent')).length,
      industryCollaborations: data.filter(a => a.title?.toLowerCase().includes('industry') || a.title?.toLowerCase().includes('collaboration')).length
    };
    
    // NBA metrics
    const nba = {
      programOutcomes: data.filter(a => a.title?.toLowerCase().includes('program outcome') || a.title?.toLowerCase().includes('po')).length,
      courseOutcomes: data.filter(a => a.title?.toLowerCase().includes('course outcome') || a.title?.toLowerCase().includes('co')).length,
      studentPlacement: data.filter(a => a.category === 'internships' || a.title?.toLowerCase().includes('placement') || a.title?.toLowerCase().includes('job offer')).length,
      higherEducation: data.filter(a => a.title?.toLowerCase().includes('higher education') || a.title?.toLowerCase().includes('masters') || a.title?.toLowerCase().includes('phd')).length,
      entrepreneurship: data.filter(a => a.title?.toLowerCase().includes('startup') || a.title?.toLowerCase().includes('entrepreneur')).length
    };
    
    setNaacMetrics(naac);
    setNbaMetrics(nba);
  };
  
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
      level: "all",
      startDate: undefined,
      endDate: undefined
    });
    
    getAllAchievements({}).then((achievementsData) => {
      setAchievements(achievementsData);
      calculateAccreditationMetrics(achievementsData);
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
      "Year",
      "Semester",
      "Academic Year",
      "CGPA",
      "SGPA"
    ].join(","));
    
    // Add row data
    achievements.forEach(achievement => {
      const date = achievement.date instanceof Date
        ? format(achievement.date, "yyyy-MM-dd")
        : format(achievement.date.toDate(), "yyyy-MM-dd");
      
      csvRows.push([
        `"${achievement.title?.replace(/"/g, '""') || ''}"`,
        `"${achievement.category || ''}"`,
        `"${achievement.level || 'N/A'}"`,
        `"${date}"`,
        `"${achievement.status || ''}"`,
        `"${achievement.studentName || ''}"`,
        `"${achievement.rollNo || ''}"`,
        `"${achievement.branch || ''}"`,
        `"${achievement.year || ''}"`,
        `"${achievement.semester || ''}"`,
        `"${achievement.academicYear || ''}"`,
        `"${achievement.cgpa || ''}"`,
        `"${achievement.sgpa || ''}"`,
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
    
    toast({
      title: "Report Downloaded",
      description: `Downloaded ${achievements.length} records to CSV file`,
    });
  };

  // Calculate summary counts for quick stats
  const getTotalsByStatus = () => {
    const approved = achievements.filter(a => a.status === 'approved').length;
    const pending = achievements.filter(a => a.status === 'pending').length;
    const rejected = achievements.filter(a => a.status === 'rejected').length;
    
    return { approved, pending, rejected, total: achievements.length };
  };
  
  const stats = getTotalsByStatus();
  
  // Generate NAAC/NBA summary data for charts
  const generateAccreditationChartData = () => {
    const naacData = [
      { name: 'Research Publications', value: naacMetrics.totalResearchPublications },
      { name: 'International Conferences', value: naacMetrics.internationalConferences },
      { name: 'National Conferences', value: naacMetrics.nationalConferences },
      { name: 'Patents', value: naacMetrics.patents },
      { name: 'Industry Collaborations', value: naacMetrics.industryCollaborations },
    ];
    
    const nbaData = [
      { name: 'Program Outcomes', value: nbaMetrics.programOutcomes },
      { name: 'Course Outcomes', value: nbaMetrics.courseOutcomes },
      { name: 'Student Placement', value: nbaMetrics.studentPlacement },
      { name: 'Higher Education', value: nbaMetrics.higherEducation },
      { name: 'Entrepreneurship', value: nbaMetrics.entrepreneurship },
    ];
    
    return { naacData, nbaData };
  };
  
  const { naacData, nbaData } = generateAccreditationChartData();
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Achievement Reports</h1>
          <p className="text-gray-500">Comprehensive analytics for NAAC and NBA accreditation</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
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
            Download CSV Report
          </Button>
        </div>
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            <FileBarChart2 className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All submitted achievements</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${Math.round((stats.approved / stats.total) * 100)}% of total` : '0%'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${Math.round((stats.pending / stats.total) * 100)}% of total` : '0%'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${Math.round((stats.rejected / stats.total) * 100)}% of total` : '0%'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="mb-2">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="accreditation">NAAC & NBA</TabsTrigger>
          <TabsTrigger value="filters">Advanced Filters</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="filters">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Filter Reports</CardTitle>
              <CardDescription>Customize reports by applying filters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select
                    value={filters.branch}
                    onValueChange={(value) => handleFilterChange("branch", value)}
                  >
                    <SelectTrigger className="w-full">
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
                  <Label>Year</Label>
                  <Select
                    value={filters.year}
                    onValueChange={(value) => handleFilterChange("year", value)}
                  >
                    <SelectTrigger className="w-full">
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
                  <Label>Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange("category", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="academic">Academic Excellence</SelectItem>
                      <SelectItem value="technical">Technical Skills</SelectItem>
                      <SelectItem value="research">Research & Projects</SelectItem>
                      <SelectItem value="competition">Competitions</SelectItem>
                      <SelectItem value="extra-curricular">Extra-Curricular</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="internships">Internships</SelectItem>
                      <SelectItem value="hackathon">Hackathons</SelectItem>
                      <SelectItem value="workshops">Workshops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select
                    value={filters.level}
                    onValueChange={(value) => handleFilterChange("level", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      <SelectItem value="college">College Level</SelectItem>
                      <SelectItem value="state">State/Regional Level</SelectItem>
                      <SelectItem value="national">National Level</SelectItem>
                      <SelectItem value="international">International Level</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="research">Research Institution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {filters.startDate ? format(filters.startDate, "MMM dd, yyyy") : "Start date"}
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
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {filters.endDate ? format(filters.endDate, "MMM dd, yyyy") : "End date"}
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
                
                <div className="md:col-span-5 mt-4">
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
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Loading report data...</p>
            </div>
          ) : (
            <AchievementAnalytics achievements={achievements} />
          )}
        </TabsContent>
        
        <TabsContent value="accreditation" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* NAAC Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  NAAC Metrics
                </CardTitle>
                <CardDescription>Key indicators for NAAC accreditation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={naacData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {naacData.map((item, index) => (
                    <div key={`naac-${index}`} className="flex justify-between border-b pb-2">
                      <span className="text-sm font-medium">{item.name}:</span>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* NBA Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  NBA Outcomes
                </CardTitle>
                <CardDescription>Program outcomes and attainment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={nbaData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {nbaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {nbaData.map((item, index) => (
                    <div key={`nba-${index}`} className="flex justify-between border-b pb-2">
                      <span className="text-sm font-medium">{item.name}:</span>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Academic Progression */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Academic Progression & Achievements</CardTitle>
                <CardDescription>Student growth and academic performance correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800">Top Performing Students</h3>
                      <p className="text-2xl font-bold">{achievements.filter(a => Number(a.cgpa) > 9.0).length}</p>
                      <p className="text-sm text-green-700">Students with CGPA {'>'} 9.0</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-800">Research Participation</h3>
                      <p className="text-2xl font-bold">{achievements.filter(a => a.category === 'research').length}</p>
                      <p className="text-sm text-blue-700">Students engaged in research</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-800">Placement & Internships</h3>
                      <p className="text-2xl font-bold">{achievements.filter(a => a.category === 'internships').length}</p>
                      <p className="text-sm text-purple-700">Students with industry exposure</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Key Observations for NAAC/NBA</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Student participation in extra-curricular activities: <strong>{achievements.filter(a => a.category === 'extra-curricular').length} students</strong></li>
                      <li>Technical skill development: <strong>{achievements.filter(a => a.category === 'technical').length} achievements</strong></li>
                      <li>International exposure: <strong>{achievements.filter(a => a.level === 'international').length} participants</strong></li>
                      <li>Industry-academia collaboration: <strong>{naacMetrics.industryCollaborations} initiatives</strong></li>
                      <li>Entrepreneurship ventures: <strong>{nbaMetrics.entrepreneurship} startups</strong></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          {/* Summary Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Achievement Data</CardTitle>
              <CardDescription>
                Detailed view of {achievements.length} achievements
                {filters.branch !== "all" ? ` for ${filters.branch} branch` : ""}
                {filters.year !== "all" ? ` in year ${filters.year}` : ""}
                {filters.category !== "all" ? ` in ${filters.category} category` : ""}
                {filters.level !== "all" ? ` at ${filters.level} level` : ""}
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
                      <TableHead>Semester</TableHead>
                      <TableHead>SGPA</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {achievements.slice(0, 15).map((achievement) => (
                      <TableRow key={achievement.id}>
                        <TableCell className="font-medium">{achievement.studentName}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={achievement.title}>
                            {achievement.title}
                          </div>
                        </TableCell>
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
                        <TableCell>{achievement.semester || "N/A"}</TableCell>
                        <TableCell>{achievement.sgpa || "N/A"}</TableCell>
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
                    {achievements.length > 15 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                          Showing 15 of {achievements.length} results. Download the CSV for full data.
                        </TableCell>
                      </TableRow>
                    )}
                    {achievements.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                          No achievements found matching the filter criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
