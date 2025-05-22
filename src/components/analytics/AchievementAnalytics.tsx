
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Scatter,
  ScatterChart,
  ZAxis,
  Treemap
} from "recharts";
import { 
  BarChartHorizontal, 
  ChartArea, 
  PieChart, 
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Define types for achievement and props
interface Achievement {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  date?: any;
  status?: string;
  studentName?: string;
  rollNo?: string;
  branch?: string;
  year?: string;
  semester?: string;
  academicYear?: string;
  cgpa?: string;
  sgpa?: string;
}

interface AchievementAnalyticsProps {
  achievements: Achievement[];
}

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042', '#ff6b6b', '#f782c2'];

const AchievementAnalytics = ({ achievements }: AchievementAnalyticsProps) => {
  const [chartView, setChartView] = useState<'category' | 'level' | 'year' | 'branch' | 'academicYear'>('category');
  
  // Generate category data
  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    
    achievements.forEach((achievement) => {
      const category = achievement.category || 'unknown';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [achievements]);
  
  // Generate level data
  const levelData = useMemo(() => {
    const levelMap: Record<string, number> = {};
    
    achievements.forEach((achievement) => {
      const level = achievement.level || 'unknown';
      levelMap[level] = (levelMap[level] || 0) + 1;
    });
    
    return Object.entries(levelMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [achievements]);
  
  // Generate branch data
  const branchData = useMemo(() => {
    const branchMap: Record<string, number> = {};
    
    achievements.forEach((achievement) => {
      const branch = achievement.branch || 'unknown';
      branchMap[branch] = (branchMap[branch] || 0) + 1;
    });
    
    return Object.entries(branchMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [achievements]);
  
  // Generate year data
  const yearData = useMemo(() => {
    const yearMap: Record<string, number> = {};
    
    achievements.forEach((achievement) => {
      const year = achievement.year || 'unknown';
      yearMap[year] = (yearMap[year] || 0) + 1;
    });
    
    return Object.entries(yearMap).map(([name, value]) => ({
      name: `Year ${name}`,
      value,
    }));
  }, [achievements]);
  
  // Generate academic year data
  const academicYearData = useMemo(() => {
    const academicYearMap: Record<string, number> = {};
    
    achievements.forEach((achievement) => {
      const academicYear = achievement.academicYear || 'unknown';
      academicYearMap[academicYear] = (academicYearMap[academicYear] || 0) + 1;
    });
    
    return Object.entries(academicYearMap)
      .filter(([name]) => name !== 'unknown')
      .map(([name, value]) => ({
        name,
        value,
      }));
  }, [achievements]);
  
  // Generate semester data
  const semesterData = useMemo(() => {
    const semesterMap: Record<string, number> = {};
    
    achievements.forEach((achievement) => {
      const semester = achievement.semester || 'unknown';
      semesterMap[semester] = (semesterMap[semester] || 0) + 1;
    });
    
    return Object.entries(semesterMap)
      .filter(([name]) => name !== 'unknown')
      .map(([name, value]) => ({
        name: `Sem ${name}`,
        value,
      }));
  }, [achievements]);
  
  // Calculate monthly trends
  const monthlyTrends = useMemo(() => {
    const monthMap: Record<string, number> = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize all months
    for (let i = 0; i < 12; i++) {
      const monthName = format(new Date(currentYear, i, 1), 'MMM');
      monthMap[monthName] = 0;
    }
    
    achievements.forEach((achievement) => {
      if (!achievement.date) return;
      
      const date = achievement.date instanceof Date 
        ? achievement.date 
        : achievement.date.toDate?.() || new Date(achievement.date);
      
      const monthName = format(date, 'MMM');
      monthMap[monthName] = (monthMap[monthName] || 0) + 1;
    });
    
    return Object.entries(monthMap).map(([name, count]) => ({
      name,
      count,
    }));
  }, [achievements]);
  
  // Calculate CGPA distribution
  const cgpaDistribution = useMemo(() => {
    const ranges = [
      { range: '9.0-10.0', min: 9.0, max: 10.0, count: 0 },
      { range: '8.0-8.9', min: 8.0, max: 8.9, count: 0 },
      { range: '7.0-7.9', min: 7.0, max: 7.9, count: 0 },
      { range: '6.0-6.9', min: 6.0, max: 6.9, count: 0 },
      { range: '<6.0', min: 0, max: 5.9, count: 0 },
    ];
    
    achievements.forEach((achievement) => {
      if (!achievement.cgpa) return;
      
      const cgpa = parseFloat(achievement.cgpa);
      const matchedRange = ranges.find(r => cgpa >= r.min && cgpa <= r.max);
      
      if (matchedRange) {
        matchedRange.count++;
      }
    });
    
    return ranges;
  }, [achievements]);
  
  // Calculate correlations between CGPA and achievement counts
  const performanceCorrelation = useMemo(() => {
    const studentMap: Record<string, { cgpa: number; achievements: number }> = {};
    
    achievements.forEach((achievement) => {
      if (!achievement.rollNo || !achievement.cgpa) return;
      
      if (!studentMap[achievement.rollNo]) {
        studentMap[achievement.rollNo] = { 
          cgpa: parseFloat(achievement.cgpa), 
          achievements: 0 
        };
      }
      
      studentMap[achievement.rollNo].achievements++;
    });
    
    return Object.values(studentMap).map(({ cgpa, achievements }) => ({
      cgpa,
      achievements,
      z: 1, // Size factor for bubble chart
    }));
  }, [achievements]);

  // Current chart data based on selected view
  const getCurrentChartData = () => {
    switch (chartView) {
      case 'category':
        return categoryData;
      case 'level':
        return levelData;
      case 'year':
        return yearData;
      case 'branch':
        return branchData;
      case 'academicYear':
        return academicYearData;
      default:
        return categoryData;
    }
  };
  
  // Format for chart labels
  const getChartTitle = () => {
    switch (chartView) {
      case 'category':
        return 'Achievement by Category';
      case 'level':
        return 'Achievement by Level';
      case 'year':
        return 'Achievement by Year';
      case 'branch':
        return 'Achievement by Branch';
      case 'academicYear':
        return 'Achievement by Academic Year';
      default:
        return 'Achievement Distribution';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Distribution Chart */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              {getChartTitle()}
            </CardTitle>
            <Select value={chartView} onValueChange={(value: any) => setChartView(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="level">Level</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="branch">Branch</SelectItem>
                <SelectItem value="academicYear">Academic Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCurrentChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ChartArea className="h-5 w-5 mr-2" />
              Achievement Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Achievements" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="distribution">Distributions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="academic">Academic Data</TabsTrigger>
        </TabsList>
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Achievement Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Level Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChartHorizontal className="h-5 w-5 mr-2" />
                  Achievement Level Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={levelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={120}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Branch Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Branch Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }} 
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Year Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Year-wise Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={yearData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {yearData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CGPA Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  CGPA Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cgpaDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Students" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Performance Correlation */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ChartArea className="h-5 w-5 mr-2" />
                  CGPA vs Achievement Correlation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey="cgpa" 
                        name="CGPA" 
                        domain={[0, 10]}
                        label={{ value: 'CGPA', position: 'bottom' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="achievements" 
                        name="Achievements"
                        label={{ value: 'Achievements', angle: -90, position: 'left' }}  
                      />
                      <ZAxis type="number" dataKey="z" range={[50, 500]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => [value, name]}
                      />
                      <Scatter 
                        name="Students" 
                        data={performanceCorrelation} 
                        fill="#8884d8" 
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium">Key Insights:</h4>
                  <ul className="list-disc pl-5 text-sm mt-2">
                    <li>Students with CGPA {'>='} 9.0: {achievements.filter(a => Number(a.cgpa) >= 9.0).length}</li>
                    <li>Students with 5+ achievements: {Object.values(
                        achievements.reduce((acc: Record<string, number>, curr) => {
                          if (curr.rollNo) {
                            acc[curr.rollNo] = (acc[curr.rollNo] || 0) + 1;
                          }
                          return acc;
                        }, {})
                      ).filter(count => count >= 5).length}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="academic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Year Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Achievement Distribution by Academic Year
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={academicYearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Achievements" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {academicYearData.length > 0 ? (
                    academicYearData.map((item) => (
                      <div key={item.name} className="flex justify-between border-b pb-1">
                        <span className="font-medium">{item.name}:</span>
                        <Badge variant="outline">{item.value} achievements</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center">No academic year data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Semester Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Achievement Distribution by Semester
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={semesterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Achievements" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {semesterData.length > 0 ? (
                    semesterData.map((item) => (
                      <div key={item.name} className="flex justify-between border-b pb-1">
                        <span className="font-medium">{item.name}:</span>
                        <Badge variant="outline">{item.value}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center col-span-2">No semester data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* NAAC & NBA Analysis */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  NAAC & NBA Metric Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-md border-b pb-2">NAAC Indicators</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Research Publications:</span>
                        <Badge variant="outline">{achievements.filter(a => a.category === 'research' || a.title?.toLowerCase().includes('research') || a.title?.toLowerCase().includes('publication')).length}</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span>International Conferences:</span>
                        <Badge variant="outline">{achievements.filter(a => a.level === 'international').length}</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span>Extracurricular Activities:</span>
                        <Badge variant="outline">{achievements.filter(a => a.category === 'extra-curricular').length}</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span>Sports Achievements:</span>
                        <Badge variant="outline">{achievements.filter(a => a.category === 'sports').length}</Badge>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-md border-b pb-2">NBA Outcomes</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Technical Skills:</span>
                        <Badge variant="outline">{achievements.filter(a => a.category === 'technical').length}</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span>Internships/Placements:</span>
                        <Badge variant="outline">{achievements.filter(a => a.category === 'internships').length}</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span>Hackathons/Competitions:</span> 
                        <Badge variant="outline">{achievements.filter(a => a.category === 'hackathon' || a.category === 'competition').length}</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span>Industry Workshops:</span>
                        <Badge variant="outline">{achievements.filter(a => a.category === 'workshops').length}</Badge>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementAnalytics;
