
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    default: return level.charAt(0).toUpperCase() + level.slice(1);
  }
};

const AchievementAnalytics: React.FC<AchievementAnalyticsProps> = ({ achievements }) => {
  // Process data for charts
  const processChartData = (field: keyof Achievement, formatter?: (value: string) => string) => {
    const counts: Record<string, number> = {};
    
    achievements.forEach(achievement => {
      const value = achievement[field] as string;
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    
    return Object.entries(counts).map(([name, count]) => ({
      name: formatter ? formatter(name) : name,
      value: count,
    }));
  };

  // Generate chart data
  const categoryData = processChartData('category', formatCategoryName);
  const levelData = processChartData('level', formatLevelName);
  const statusData = processChartData('status', (s) => s.charAt(0).toUpperCase() + s.slice(1));
  const branchData = processChartData('branch');
  const yearData = processChartData('year', (year) => `Year ${year}`);
  
  // Generate level distribution by category
  const categoryLevelData: Record<AchievementCategory, Record<AchievementLevel, number>> = {} as any;
  
  achievements.forEach(achievement => {
    if (achievement.category && achievement.level) {
      if (!categoryLevelData[achievement.category]) {
        categoryLevelData[achievement.category] = {
          'college': 0,
          'state': 0,
          'national': 0,
          'international': 0
        };
      }
      categoryLevelData[achievement.category][achievement.level]++;
    }
  });
  
  // Convert to recharts format
  const categoryLevelChartData = Object.entries(categoryLevelData).map(([category, levels]) => {
    return {
      name: formatCategoryName(category),
      college: levels.college || 0,
      state: levels.state || 0,
      national: levels.national || 0,
      international: levels.international || 0
    };
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="levels">Achievement Levels</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{achievements.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {achievements.filter(a => a.status === 'approved').length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">National Level</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {achievements.filter(a => a.level === 'national').length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">International Level</CardTitle>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryData.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.value} achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>College Level:</span>
                      <span className="font-medium">
                        {achievements.filter(a => a.category === Object.keys(categoryLevelData)[index] && a.level === 'college').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>State Level:</span>
                      <span className="font-medium">
                        {achievements.filter(a => a.category === Object.keys(categoryLevelData)[index] && a.level === 'state').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>National Level:</span>
                      <span className="font-medium">
                        {achievements.filter(a => a.category === Object.keys(categoryLevelData)[index] && a.level === 'national').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>International Level:</span>
                      <span className="font-medium">
                        {achievements.filter(a => a.category === Object.keys(categoryLevelData)[index] && a.level === 'international').length}
                      </span>
                    </div>
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
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="college" name="College Level" fill="#1E88E5" />
                  <Bar dataKey="state" name="State Level" fill="#43A047" />
                  <Bar dataKey="national" name="National Level" fill="#FB8C00" />
                  <Bar dataKey="international" name="International Level" fill="#D81B60" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levelData.map((level, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{level.name}</CardTitle>
                  <CardDescription>{level.value} achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryData.map((category, catIndex) => (
                      <div key={catIndex} className="flex justify-between">
                        <span>{category.name}:</span>
                        <span className="font-medium">
                          {achievements.filter(a => 
                            a.level === Object.keys({college: 'college', state: 'state', national: 'national', international: 'international'})[index] && 
                            a.category === Object.keys({academic: 'academic', technical: 'technical', research: 'research', competition: 'competition', 'extra-curricular': 'extra-curricular'})[catIndex]
                          ).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                      <Cell fill={STATUS_COLORS.approved} />
                      <Cell fill={STATUS_COLORS.pending} />
                      <Cell fill={STATUS_COLORS.rejected} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gap Analysis</CardTitle>
                <CardDescription>Areas needing improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Simple gap analysis based on level distribution */}
                  <div>
                    <h3 className="font-medium mb-2">Level Distribution:</h3>
                    <div className="space-y-2">
                      {levelData.map((level, index) => {
                        const percentage = (level.value / achievements.length * 100).toFixed(1);
                        const isLow = parseFloat(percentage) < 15; // Arbitrary threshold for demonstration
                        
                        return (
                          <div key={index} className={`flex justify-between ${isLow ? 'text-orange-600 font-medium' : ''}`}>
                            <span>{level.name}:</span>
                            <span>{percentage}% {isLow && '(Needs Improvement)'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Simple gap analysis based on category distribution */}
                  <div>
                    <h3 className="font-medium mb-2">Category Distribution:</h3>
                    <div className="space-y-2">
                      {categoryData.map((category, index) => {
                        const percentage = (category.value / achievements.length * 100).toFixed(1);
                        const isLow = parseFloat(percentage) < 10; // Arbitrary threshold for demonstration
                        
                        return (
                          <div key={index} className={`flex justify-between ${isLow ? 'text-orange-600 font-medium' : ''}`}>
                            <span>{category.name}:</span>
                            <span>{percentage}% {isLow && '(Needs Improvement)'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
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
                Visualize changes and trends in achievement data over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>
                  Trend data will be visualized here once semester and academic year data is available.
                  <br />
                  This requires historical achievement data across multiple semesters.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementAnalytics;
