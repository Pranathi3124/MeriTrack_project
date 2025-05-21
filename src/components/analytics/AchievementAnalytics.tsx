
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Achievement, AchievementCategory, AchievementLevel } from "@/lib/firebase";

type AchievementAnalyticsProps = {
  achievements: Achievement[];
};

const COLORS = ['#8B0000', '#1E88E5', '#43A047', '#FB8C00', '#D81B60', '#8E24AA', '#3949AB', '#00ACC1'];
const STATUS_COLORS = {
  approved: '#43A047', // Green
  pending: '#FB8C00',  // Orange
  rejected: '#D81B60'  // Pink/Red
};

// Helper function to format category names
const formatCategoryName = (category: string): string => {
  switch(category) {
    case 'academic': return 'Academic Excellence';
    case 'technical': return 'Technical Certifications';
    case 'research': return 'Research & Publications';
    case 'competition': return 'Competitions & Hackathons';
    case 'extra-curricular': return 'Extra-Curricular';
    case 'sports': return 'Sports';
    case 'internships': return 'Internships';
    case 'hackathon': return 'Hackathons';
    case 'workshops': return 'Workshops';
    default: return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

// Helper function to format level names
const formatLevelName = (level: string): string => {
  switch(level) {
    case 'college': return 'College Level';
    case 'state': return 'State/Regional Level';
    case 'national': return 'National Level';
    case 'international': return 'International Level';
    case 'company': return 'Company';
    case 'startup': return 'Startup';
    case 'government': return 'Government';
    case 'research': return 'Research Institution';
    default: return level.charAt(0).toUpperCase() + level.slice(1);
  }
};

const AchievementAnalytics: React.FC<AchievementAnalyticsProps> = ({ achievements }) => {
  const [selectedMetric, setSelectedMetric] = useState<'count' | 'gpa'>('count');
  
  // Process data for charts
  const processChartData = (field: keyof Achievement, formatter?: (value: string) => string) => {
    const counts: Record<string, number> = {};
    
    achievements.forEach(achievement => {
      const value = achievement[field] as string;
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({
        name: formatter ? formatter(name) : name,
        value: count,
      }))
      .sort((a, b) => b.value - a.value); // Sort by value in descending order
  };

  // Generate chart data
  const categoryData = processChartData('category', formatCategoryName);
  const levelData = processChartData('level', formatLevelName);
  const statusData = processChartData('status', (s) => s.charAt(0).toUpperCase() + s.slice(1));
  const branchData = processChartData('branch');
  const yearData = processChartData('year', (year) => `Year ${year}`);
  const semesterData = processChartData('semester', (sem) => `Semester ${sem}`);
  const academicYearData = processChartData('academicYear');
  
  // Generate level distribution by category
  const categoryLevelDistribution: Record<string, Record<string, number>> = {};
  
  achievements.forEach(achievement => {
    if (achievement.category && achievement.level) {
      const category = achievement.category;
      const level = achievement.level;
      
      if (!categoryLevelDistribution[category]) {
        categoryLevelDistribution[category] = {};
      }
      
      if (!categoryLevelDistribution[category][level]) {
        categoryLevelDistribution[category][level] = 0;
      }
      
      categoryLevelDistribution[category][level]++;
    }
  });
  
  // Convert to recharts format for category-level distribution
  const categoryLevelChartData = Object.entries(categoryLevelDistribution).map(([category, levels]) => {
    const formattedCategory = formatCategoryName(category);
    const data: any = { name: formattedCategory };
    
    Object.entries(levels).forEach(([level, count]) => {
      data[level] = count;
    });
    
    return data;
  });

  // Process GPA data if available
  const academicAchievements = achievements.filter(a => a.category === 'academic' && (a.cgpa || a.sgpa));
  
  // Group academic achievements by semester for trend analysis
  const semesterGpaMap: Record<string, { count: number, totalCGPA: number, totalSGPA: number }> = {};
  
  academicAchievements.forEach(achievement => {
    const semester = achievement.semester;
    if (semester) {
      if (!semesterGpaMap[semester]) {
        semesterGpaMap[semester] = { count: 0, totalCGPA: 0, totalSGPA: 0 };
      }
      
      if (achievement.cgpa) {
        semesterGpaMap[semester].totalCGPA += parseFloat(achievement.cgpa as string);
        semesterGpaMap[semester].count++;
      }
      
      if (achievement.sgpa) {
        semesterGpaMap[semester].totalSGPA += parseFloat(achievement.sgpa as string);
      }
    }
  });
  
  // Convert semester GPA data to chart format
  const gpaChartData = Object.entries(semesterGpaMap)
    .map(([semester, data]) => ({
      name: `Semester ${semester}`,
      CGPA: data.totalCGPA / (data.count || 1),
      SGPA: data.totalSGPA / (data.count || 1),
    }))
    .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

  // Process trend data by academic year or semester
  const processTrendData = () => {
    const trendData: Record<string, Record<string, number>> = {};
    
    achievements.forEach(achievement => {
      const academicYear = achievement.academicYear || 'Unknown';
      const category = achievement.category || 'Unknown';
      
      if (!trendData[academicYear]) {
        trendData[academicYear] = {};
      }
      
      if (!trendData[academicYear][category]) {
        trendData[academicYear][category] = 0;
      }
      
      trendData[academicYear][category]++;
    });
    
    // Convert to array format for charts
    return Object.entries(trendData)
      .map(([year, categories]) => ({
        name: year,
        ...categories,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };
  
  const trendChartData = processTrendData();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="levels">Achievement Levels</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="academic">Academic Data</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{achievements.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {achievements.filter(a => a.status === 'approved').length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">National Level</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {achievements.filter(a => a.level === 'national').length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">International</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {achievements.filter(a => a.level === 'international').length}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements by Category</CardTitle>
                <CardDescription>Distribution across achievement categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Achievements by Level</CardTitle>
                <CardDescription>Distribution across achievement levels</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={levelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {levelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Categories</CardTitle>
              <CardDescription>Detailed breakdown of each achievement category</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Achievements" fill="#8B0000">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.value} achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {levelData.map((level, levelIndex) => {
                      // Find the raw category and level keys
                      const categoryKey = Object.keys(categoryLevelDistribution).find(
                        key => formatCategoryName(key) === category.name
                      );
                      const levelKey = Object.keys(categoryLevelDistribution[categoryKey || ''] || {}).find(
                        key => formatLevelName(key) === level.name
                      );
                      
                      // Get the count for this category-level combination
                      const count = categoryKey && levelKey
                        ? categoryLevelDistribution[categoryKey][levelKey] || 0
                        : 0;
                      
                      return (
                        <div key={levelIndex} className="flex justify-between">
                          <span>{level.name}:</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Levels Tab */}
        <TabsContent value="levels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Levels Distribution</CardTitle>
              <CardDescription>Breakdown of achievements by category and level</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryLevelChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" scale="band" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(categoryLevelDistribution).reduce((acc: string[], category) => {
                    Object.keys(categoryLevelDistribution[category]).forEach(level => {
                      if (!acc.includes(level)) acc.push(level);
                    });
                    return acc;
                  }, []).map((level, index) => (
                    <Bar 
                      key={level}
                      dataKey={level}
                      name={formatLevelName(level)} 
                      fill={COLORS[index % COLORS.length]} 
                      stackId="a" 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levelData.map((level, index) => {
              // Find the raw level key
              const levelKey = Object.keys(categoryLevelDistribution).reduce((acc: string, category) => {
                const matchingLevel = Object.keys(categoryLevelDistribution[category]).find(
                  lvl => formatLevelName(lvl) === level.name
                );
                return matchingLevel || acc;
              }, "");
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{level.name}</CardTitle>
                    <CardDescription>{level.value} achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categoryData.map((category, catIndex) => {
                        // Find the raw category key
                        const categoryKey = Object.keys(categoryLevelDistribution).find(
                          key => formatCategoryName(key) === category.name
                        );
                        
                        // Find matching level key for this category
                        const matchingLevelKey = categoryKey ? Object.keys(categoryLevelDistribution[categoryKey]).find(
                          lvl => formatLevelName(lvl) === level.name
                        ) : undefined;
                        
                        const count = categoryKey && matchingLevelKey 
                          ? categoryLevelDistribution[categoryKey][matchingLevelKey] 
                          : 0;
                        
                        return (
                          <div key={catIndex} className="flex justify-between">
                            <span>{category.name}:</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Branch</CardTitle>
                <CardDescription>Achievement counts across departments</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={branchData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Achievements" fill="#8B0000" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Year</CardTitle>
                <CardDescription>Achievements across academic years</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Achievements" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Current status of achievements</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry) => {
                        let color = STATUS_COLORS.pending;
                        if (entry.name.toLowerCase() === 'approved') color = STATUS_COLORS.approved;
                        if (entry.name.toLowerCase() === 'rejected') color = STATUS_COLORS.rejected;
                        return <Cell key={entry.name} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Semester</CardTitle>
                <CardDescription>Achievements across semesters</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={semesterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Achievements" fill="#D81B60" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Trends</CardTitle>
              <CardDescription>
                Achievement trends over academic years
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {trendChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(trendChartData[0] || {})
                      .filter(key => key !== 'name')
                      .map((category, index) => (
                        <Line 
                          key={category}
                          type="monotone" 
                          dataKey={category} 
                          name={formatCategoryName(category)}
                          stroke={COLORS[index % COLORS.length]} 
                          activeDot={{ r: 8 }} 
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                  <p>
                    Upload achievements with academic year data to see trends.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievement Distribution by Academic Year</CardTitle>
              <CardDescription>Total achievements per academic year</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {academicYearData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={academicYearData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Achievements" fill="#8B0000" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                  <p>
                    No academic year data available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Data Tab */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>GPA trends across semesters</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {gpaChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={gpaChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="CGPA" stroke="#8B0000" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="SGPA" stroke="#1E88E5" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                  <p>
                    No GPA data available. Add academic achievements with GPA information.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average CGPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {academicAchievements.length > 0 
                    ? (academicAchievements.reduce((acc, curr) => 
                        acc + (curr.cgpa ? parseFloat(curr.cgpa as string) : 0), 
                        0) / academicAchievements.length).toFixed(2)
                    : "N/A"}
                </div>
                <p className="text-sm text-gray-500">
                  Across {academicAchievements.length} academic achievements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average SGPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {academicAchievements.length > 0 
                    ? (academicAchievements.reduce((acc, curr) => 
                        acc + (curr.sgpa ? parseFloat(curr.sgpa as string) : 0), 
                        0) / academicAchievements.length).toFixed(2)
                    : "N/A"}
                </div>
                <p className="text-sm text-gray-500">
                  Average across all semesters
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {academicAchievements.length}
                </div>
                <p className="text-sm text-gray-500">
                  Total academic records
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementAnalytics;
