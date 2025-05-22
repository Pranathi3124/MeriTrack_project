
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter,
  ComposedChart, Treemap
} from 'recharts';
import { 
  ChartPie, ChartBar, ChartBarHorizontal, ChartLine, ChartAreaLine, 
  ChartScatter, ChartColumnStacked, ChartTreemap 
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Achievement, AchievementCategory, AchievementLevel } from "@/lib/firebase";

type AchievementAnalyticsProps = {
  achievements: Achievement[];
};

// Define enhanced color palette for better visualization
const COLORS = [
  '#8B0000', '#1E88E5', '#43A047', '#FB8C00', '#D81B60', 
  '#8E24AA', '#3949AB', '#00ACC1', '#9b87f5', '#7E69AB'
];

const STATUS_COLORS = {
  approved: '#43A047', // Green
  pending: '#FB8C00',  // Orange
  rejected: '#D81B60'  // Pink/Red
};

// Interface for semester GPA data
interface SemesterGpaData {
  [semester: string]: { 
    count: number;
    totalCGPA: number;
    totalSGPA: number;
  }
}

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

// Custom label for pie charts
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#fff" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AchievementAnalytics: React.FC<AchievementAnalyticsProps> = ({ achievements }) => {
  const [selectedMetric, setSelectedMetric] = useState<'count' | 'gpa'>('count');
  const [chartType, setChartType] = useState<string>('default');
  
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

  // Create radar data format for categories by level
  const radarChartData = levelData.map(level => {
    const data: any = { name: level.name };
    
    categoryData.forEach(category => {
      // Find the raw category key
      const categoryKey = Object.keys(categoryLevelDistribution).find(
        key => formatCategoryName(key) === category.name
      );
      
      // Find the raw level key
      const levelKey = Object.keys(categoryLevelDistribution[categoryKey || ''] || {}).find(
        key => formatLevelName(key) === level.name
      );
      
      const count = categoryKey && levelKey ? categoryLevelDistribution[categoryKey][levelKey] || 0 : 0;
      data[category.name] = count;
    });
    
    return data;
  });

  // Process GPA data if available
  const academicAchievements = achievements.filter(a => a.category === 'academic' && (a.cgpa || a.sgpa));
  
  // Group academic achievements by semester for trend analysis
  const semesterGpaMap: SemesterGpaData = {};
  
  academicAchievements.forEach(achievement => {
    const semester = achievement.semester as string;
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
        if (achievement.sgpa) semesterGpaMap[semester].count++;
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

  // Process trend data by academic year
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

  // Create treemap data for NAAC-specific reporting
  const createTreemapData = () => {
    const naacData: any[] = [];
    
    // Group by category
    const categoryGroups = categoryData.map(category => {
      const children = achievements
        .filter(a => a.category === Object.keys(categoryLevelDistribution).find(
          key => formatCategoryName(key) === category.name
        ))
        .map(a => ({
          name: a.title.substring(0, 20) + (a.title.length > 20 ? '...' : ''),
          size: 1,
          full: a.title
        }));
      
      return {
        name: category.name,
        children
      };
    });
    
    return [{
      name: "Achievements",
      children: categoryGroups
    }];
  };
  
  const treemapData = createTreemapData();

  // Add additional data for academic performance
  const getAcademicTrends = () => {
    // Get all academic years
    const years = [...new Set(achievements.map(a => a.academicYear))].filter(Boolean);
    
    return years.map(year => {
      const yearAchievements = achievements.filter(a => a.academicYear === year && a.category === 'academic');
      const totalCGPA = yearAchievements.reduce((sum, a) => sum + (a.cgpa ? parseFloat(a.cgpa as string) : 0), 0);
      const avgCGPA = yearAchievements.length ? totalCGPA / yearAchievements.length : 0;
      
      return {
        name: year as string,
        CGPA: avgCGPA,
        Count: yearAchievements.length
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  };
  
  const academicTrendData = getAcademicTrends();

  // Add semester distribution data (for NAAC analysis)
  const semesterDistributionData = Object.entries(semesterGpaMap).map(([semester, data]) => ({
    name: `Semester ${semester}`,
    Academic: achievements.filter(a => a.semester === semester && a.category === 'academic').length,
    Technical: achievements.filter(a => a.semester === semester && a.category === 'technical').length,
    Research: achievements.filter(a => a.semester === semester && a.category === 'research').length,
    Others: achievements.filter(a => 
      a.semester === semester && 
      !['academic', 'technical', 'research'].includes(a.category as string)
    ).length,
  })).sort((a, b) => {
    const numA = parseInt(a.name.split(' ')[1]);
    const numB = parseInt(b.name.split(' ')[1]);
    return numA - numB;
  });

  // Calculate NAAC/NBA specific data
  const naacStats = {
    totalInternational: achievements.filter(a => a.level === 'international').length,
    totalNational: achievements.filter(a => a.level === 'national').length,
    totalResearch: achievements.filter(a => a.category === 'research').length,
    totalInternships: achievements.filter(a => a.category === 'internships').length,
    totalTechnical: achievements.filter(a => a.category === 'technical').length,
    totalStudents: new Set(achievements.map(a => a.rollNo)).size,
  };

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
          <TabsTrigger value="naac">NAAC/NBA Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-college-maroon">{achievements.length}</p>
                <p className="text-xs text-muted-foreground">Total submitted achievements</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {achievements.filter(a => a.status === 'approved').length}
                </p>
                <p className="text-xs text-muted-foreground">Verified achievements</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">National Level</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {achievements.filter(a => a.level === 'national').length}
                </p>
                <p className="text-xs text-muted-foreground">National achievements</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">International</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {achievements.filter(a => a.level === 'international').length}
                </p>
                <p className="text-xs text-muted-foreground">International achievements</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Achievements by Category</CardTitle>
                  <CardDescription>Distribution across achievement categories</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === 'default' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType('default')}
                  >
                    <ChartPie className="h-4 w-4 mr-1" />
                    Pie
                  </Button>
                  <Button 
                    variant={chartType === 'bar' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <ChartBar className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart
                      data={categoryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Achievements">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomizedLabel}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" verticalAlign="bottom" align="center" />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Achievements by Level</CardTitle>
                  <CardDescription>Distribution across achievement levels</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === 'default' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType('default')}
                  >
                    <ChartPie className="h-4 w-4 mr-1" />
                    Pie
                  </Button>
                  <Button 
                    variant={chartType === 'horizontal' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType('horizontal')}
                  >
                    <ChartBarHorizontal className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'horizontal' ? (
                    <BarChart
                      data={levelData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 75, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Achievements">
                        {levelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={levelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomizedLabel}
                      >
                        {levelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" verticalAlign="bottom" align="center" />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Achievement Categories</CardTitle>
                <CardDescription>Detailed breakdown of each achievement category</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={chartType === 'standard' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType('standard')}
                >
                  <ChartBar className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button 
                  variant={chartType === 'treemap' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType('treemap')}
                >
                  <ChartTreemap className="h-4 w-4 mr-1" />
                  Treemap
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'treemap' ? (
                  <Treemap
                    data={treemapData[0].children}
                    dataKey="size"
                    ratio={4/3}
                    stroke="#fff"
                    fill="#8884d8"
                    nameKey="name"
                    content={({ root, depth, x, y, width, height, name, children }) => (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          style={{
                            fill: children ? COLORS[depth % COLORS.length] : 'none',
                            stroke: '#fff',
                            strokeWidth: 2 / (depth + 1e-10),
                            strokeOpacity: 1 / (depth + 1e-10),
                          }}
                        />
                        {depth === 1 && (
                          <text
                            x={x + width / 2}
                            y={y + height / 2}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize={14}
                            fontWeight="bold"
                          >
                            {name}
                          </text>
                        )}
                      </g>
                    )}
                  />
                ) : (
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
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.value} achievements</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
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
                      
                      return count > 0 ? (
                        <div key={levelIndex} className="flex justify-between items-center">
                          <span>{level.name}:</span>
                          <Badge variant="outline" className="bg-slate-50 font-medium">
                            {count}
                          </Badge>
                        </div>
                      ) : null;
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
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Achievement Levels Distribution</CardTitle>
                <CardDescription>Breakdown of achievements by category and level</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={chartType === 'stacked' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType('stacked')}
                >
                  <ChartColumnStacked className="h-4 w-4 mr-1" />
                  Stacked
                </Button>
                <Button 
                  variant={chartType === 'radar' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType('radar')}
                >
                  <ChartScatter className="h-4 w-4 mr-1" />
                  Radar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'radar' ? (
                  <RadarChart outerRadius={90} data={radarChartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    {categoryData.slice(0, 5).map((category, index) => (
                      <Radar 
                        key={category.name} 
                        name={category.name} 
                        dataKey={category.name} 
                        stroke={COLORS[index % COLORS.length]} 
                        fill={COLORS[index % COLORS.length]} 
                        fillOpacity={0.6} 
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                ) : (
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
                )}
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
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className={`bg-gradient-to-r from-${index % 2 ? 'blue' : 'purple'}-50 to-${index % 2 ? 'blue' : 'purple'}-100`}>
                    <CardTitle>{level.name}</CardTitle>
                    <CardDescription>{level.value} achievements</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
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
                        
                        return count > 0 ? (
                          <div key={catIndex} className="flex justify-between items-center">
                            <span>{category.name}:</span>
                            <Badge variant="outline" className="bg-slate-50 font-medium">
                              {count}
                            </Badge>
                          </div>
                        ) : null;
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
                    <Bar dataKey="value" name="Achievements" fill="#1E88E5" />
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
                      label={renderCustomizedLabel}
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
                  <ComposedChart data={semesterDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Academic" stackId="a" fill="#8884d8" />
                    <Bar dataKey="Technical" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="Research" stackId="a" fill="#ffc658" />
                    <Bar dataKey="Others" stackId="a" fill="#ff8042" />
                    <Line type="monotone" dataKey="Academic" stroke="#8884d8" dot={false} />
                  </ComposedChart>
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
                      .slice(0, 5) // Limit to top 5 categories for legibility
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
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Achievement Distribution by Academic Year</CardTitle>
                <CardDescription>Total achievements per academic year</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={chartType === 'bar2' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType('bar2')}
                >
                  <ChartBar className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button 
                  variant={chartType === 'area' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType('area')}
                >
                  <ChartAreaLine className="h-4 w-4 mr-1" />
                  Area
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              {academicYearData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ? (
                    <AreaChart data={academicYearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="value" name="Achievements" fill="#8B0000" stroke="#8B0000" />
                    </AreaChart>
                  ) : (
                    <BarChart data={academicYearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Achievements" fill="#8B0000" />
                    </BarChart>
                  )}
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
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>GPA trends across semesters</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={chartType === 'line' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType('line')}
                >
                  <ChartLine className="h-4 w-4 mr-1" />
                  Line
                </Button>
                <Button 
                  variant={chartType === 'composed' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType('composed')}
                >
                  <ChartBar className="h-4 w-4 mr-1" />
                  Combined
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-96">
              {gpaChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'composed' ? (
                    <ComposedChart
                      data={gpaChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="CGPA" fill="#8B0000" />
                      <Bar dataKey="SGPA" fill="#1E88E5" />
                      <Line type="monotone" dataKey="CGPA" stroke="#8B0000" dot={{ fill: '#8B0000', strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="SGPA" stroke="#1E88E5" dot={{ fill: '#1E88E5', strokeWidth: 2 }} />
                    </ComposedChart>
                  ) : (
                    <LineChart
                      data={gpaChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="CGPA" stroke="#8B0000" activeDot={{ r: 8, fill: '#8B0000' }} strokeWidth={2} />
                      <Line type="monotone" dataKey="SGPA" stroke="#1E88E5" activeDot={{ r: 8, fill: '#1E88E5' }} strokeWidth={2} />
                    </LineChart>
                  )}
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

          <Card>
            <CardHeader>
              <CardTitle>Academic Achievement Trends</CardTitle>
              <CardDescription>
                CGPA and achievement counts over academic years
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {academicTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={academicTrendData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8B0000" />
                    <YAxis yAxisId="right" orientation="right" stroke="#1E88E5" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="right" dataKey="Count" name="Achievement Count" fill="#1E88E5" />
                    <Line yAxisId="left" type="monotone" dataKey="CGPA" name="Avg CGPA" stroke="#8B0000" strokeWidth={2} />
                  </ComposedChart>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Average CGPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-college-maroon">
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

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Average SGPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
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

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Academic Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {academicAchievements.length}
                </div>
                <p className="text-sm text-gray-500">
                  Total academic records
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Semester-wise GPA Analysis</CardTitle>
              <CardDescription>Detailed GPA breakdown for each semester</CardDescription>
            </CardHeader>
            <CardContent>
              {gpaChartData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SGPA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Achievements</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical Achievements</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {gpaChartData.map((data, index) => {
                        const semNum = data.name.split(' ')[1];
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.CGPA.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.SGPA.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {achievements.filter(a => a.semester === semNum && a.category === 'academic').length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {achievements.filter(a => a.semester === semNum && a.category === 'technical').length}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No GPA data available for semester-wise analysis
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NAAC/NBA Analysis Tab for administrative tracking */}
        <TabsContent value="naac" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">International Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">{naacStats.totalInternational}</div>
                <p className="text-xs text-muted-foreground">NAAC Criterion 5.3.1</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">National Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{naacStats.totalNational}</div>
                <p className="text-xs text-muted-foreground">NAAC Criterion 5.3.1</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Research Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">{naacStats.totalResearch}</div>
                <p className="text-xs text-muted-foreground">NBA Criterion 3</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>NBA Criteria Analysis</CardTitle>
              <CardDescription>Achievement distribution as per NBA criteria</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={[
                  { subject: 'Research', A: naacStats.totalResearch, fullMark: Math.max(naacStats.totalResearch, 10) },
                  { subject: 'Technical', A: naacStats.totalTechnical, fullMark: Math.max(naacStats.totalTechnical, 10) },
                  { subject: 'Internships', A: naacStats.totalInternships, fullMark: Math.max(naacStats.totalInternships, 10) },
                  { subject: 'International', A: naacStats.totalInternational, fullMark: Math.max(naacStats.totalInternational, 10) },
                  { subject: 'National', A: naacStats.totalNational, fullMark: Math.max(naacStats.totalNational, 10) },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                  <Radar name="Achievements" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Year-wise Achievement Analysis for NAAC</CardTitle>
              <CardDescription>Fulfilling NAAC criteria 5.3.1 and 5.3.2</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={academicYearData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="value" name="Total Achievements" fill="#8884d8" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="value"
                    name="Achievement Trend"
                    stroke="#ff7300"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Participation Rate</CardTitle>
                <CardDescription>For NBA Criterion 7 - Student Support and Progression</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-4xl font-bold text-college-maroon mb-2">{naacStats.totalStudents}</div>
                    <div className="text-sm text-muted-foreground text-center">Unique Students with Achievements</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Technical', value: naacStats.totalTechnical },
                            { name: 'Research', value: naacStats.totalResearch },
                            { name: 'Internships', value: naacStats.totalInternships },
                            { name: 'Other', value: achievements.length - naacStats.totalTechnical - naacStats.totalResearch - naacStats.totalInternships },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Semester-wise Achievement Distribution</CardTitle>
                <CardDescription>For NBA Criterion 8 - Continuous Improvement</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={semesterDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Academic" name="Academic" fill="#8884d8" />
                    <Bar dataKey="Technical" name="Technical" fill="#82ca9d" />
                    <Bar dataKey="Research" name="Research" fill="#ffc658" />
                    <Bar dataKey="Others" name="Others" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementAnalytics;
