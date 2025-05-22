
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const COLORS = ['#8B0000', '#1E88E5', '#43A047', '#FB8C00', '#D81B60'];
const STATUS_COLORS = {
  approved: '#43A047', // Green
  pending: '#FB8C00',  // Orange
  rejected: '#D81B60'  // Pink/Red
};

const LEVEL_COLORS = {
  college: '#1E88E5',     // Blue
  state: '#43A047',       // Green
  national: '#FB8C00',    // Orange
  international: '#D81B60' // Pink
};

const StudentStats = ({ achievements }) => {
  // Count achievements by category
  const getCategoryCounts = () => {
    const counts = {};
    
    // Define all possible categories
    const categories = {
      'academic': 'Academic Excellence',
      'technical': 'Technical Skills',
      'research': 'Research & Projects',
      'competition': 'Competitions',
      'extra-curricular': 'Extra-Curricular',
      'internships': 'Internships'
    };
    
    // Initialize counts
    Object.keys(categories).forEach(cat => {
      counts[cat] = 0;
    });
    
    // Count achievements
    achievements.forEach(achievement => {
      const category = achievement.category;
      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
    });
    
    // Convert to array for charts
    return Object.entries(counts)
      .filter(([_, count]) => count > 0) // Only include categories with achievements
      .map(([category, count]) => ({
        name: categories[category] || category,
        value: count
      }));
  };
  
  // Count achievements by status
  const getStatusCounts = () => {
    const counts = {
      approved: 0,
      pending: 0,
      rejected: 0
    };
    
    achievements.forEach(achievement => {
      const status = achievement.status;
      if (status && counts[status] !== undefined) {
        counts[status]++;
      }
    });
    
    return Object.entries(counts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  };
  
  // Count achievements by level
  const getLevelCounts = () => {
    const counts = {
      college: 0,
      state: 0,
      national: 0,
      international: 0,
      company: 0,
      startup: 0,
      government: 0,
      research: 0
    };
    
    achievements.forEach(achievement => {
      const level = achievement.level;
      if (level && counts[level] !== undefined) {
        counts[level]++;
      }
    });
    
    // Only include levels with non-zero counts
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([level, count]) => ({
        name: formatLevelName(level),
        value: count
      }));
  };

  // Format level names for better display
  const formatLevelName = (level) => {
    switch(level) {
      case 'college': return 'College';
      case 'state': return 'State';
      case 'national': return 'National';
      case 'international': return 'International';
      case 'company': return 'Company';
      case 'startup': return 'Startup';
      case 'government': return 'Government';
      case 'research': return 'Research';
      default: return level.charAt(0).toUpperCase() + level.slice(1);
    }
  };
  
  const categoryData = getCategoryCounts();
  const statusData = getStatusCounts();
  const levelData = getLevelCounts();
  
  // Get semester data for academic achievements
  const getSemesterData = () => {
    const semesterCounts = {};
    
    achievements.forEach(achievement => {
      if (achievement.semester) {
        const semester = `Semester ${achievement.semester}`;
        semesterCounts[semester] = (semesterCounts[semester] || 0) + 1;
      }
    });
    
    return Object.entries(semesterCounts)
      .map(([semester, count]) => ({
        name: semester,
        value: count
      }))
      .sort((a, b) => {
        const semA = parseInt(a.name.split(' ')[1]);
        const semB = parseInt(b.name.split(' ')[1]);
        return semA - semB;
      });
  };
  
  const semesterData = getSemesterData();
  
  // Get academic performance data (GPA trends)
  const getAcademicData = () => {
    const semesterGpaMap = {};
    
    achievements
      .filter(a => a.category === 'academic' && (a.cgpa || a.sgpa))
      .forEach(achievement => {
        const semester = achievement.semester;
        if (semester) {
          if (!semesterGpaMap[semester]) {
            semesterGpaMap[semester] = { count: 0, totalCGPA: 0, totalSGPA: 0 };
          }
          
          if (achievement.cgpa) {
            semesterGpaMap[semester].totalCGPA += parseFloat(achievement.cgpa);
            semesterGpaMap[semester].count++;
          }
          
          if (achievement.sgpa) {
            semesterGpaMap[semester].totalSGPA += parseFloat(achievement.sgpa);
          }
        }
      });
    
    return Object.entries(semesterGpaMap)
      .map(([semester, data]) => ({
        name: `Sem ${semester}`,
        CGPA: data.totalCGPA / (data.count || 1),
        SGPA: data.totalSGPA / (data.count || 1)
      }))
      .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
  };
  
  const academicData = getAcademicData();
  
  // Get category level data
  const getCategoryLevelData = () => {
    // Define all categories and levels
    const categories = {
      'academic': 'Academic',
      'technical': 'Technical',
      'research': 'Research',
      'competition': 'Competitions',
      'extra-curricular': 'Extra-Curricular',
      'internships': 'Internships'
    };
    
    const levels = ['college', 'state', 'national', 'international', 'company', 'startup', 'government', 'research'];
    
    // Initialize data structure
    const data = {};
    Object.keys(categories).forEach(category => {
      data[category] = {
        name: categories[category],
        college: 0,
        state: 0,
        national: 0,
        international: 0,
        company: 0,
        startup: 0,
        government: 0,
        research: 0
      };
    });
    
    // Count achievements
    achievements.forEach(achievement => {
      if (achievement.category && achievement.level && data[achievement.category]) {
        if (levels.includes(achievement.level)) {
          data[achievement.category][achievement.level]++;
        }
      }
    });
    
    // Filter to only include categories with data
    return Object.values(data).filter(categoryData => {
      return Object.entries(categoryData)
        .filter(([key, _]) => key !== 'name')
        .some(([_, count]) => count > 0);
    });
  };
  
  const categoryLevelData = getCategoryLevelData();
  
  const hasAcademicData = academicData.length > 0;
  const hasSemesterData = semesterData.length > 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </CardHeader>
          <CardContent className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={categoryData.length <= 5}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      percent > 0.1 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} achievements`, 'Count']} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No achievement data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Achievement Levels</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {levelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    labelLine={levelData.length <= 5}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      percent > 0.1 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {levelData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} achievements`, 'Count']} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No achievement level data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {hasSemesterData && (
        <Card>
          <CardHeader>
            <CardTitle>Distribution by Semester</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} achievements`, 'Count']} />
                <Legend />
                <Bar dataKey="value" name="Achievements" fill="#8B0000" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution by Level</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          {categoryLevelData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryLevelData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="college" name="College Level" fill={COLORS[0]} />
                <Bar dataKey="state" name="State Level" fill={COLORS[1]} />
                <Bar dataKey="national" name="National Level" fill={COLORS[2]} />
                <Bar dataKey="international" name="International Level" fill={COLORS[3]} />
                <Bar dataKey="company" name="Company" fill={COLORS[4]} />
                <Bar dataKey="startup" name="Startup" fill={COLORS[0]} />
                <Bar dataKey="government" name="Government" fill={COLORS[1]} />
                <Bar dataKey="research" name="Research Institution" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No category-level distribution data available</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Approval Status</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} achievements`, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Achievements">
                <Cell fill={STATUS_COLORS.approved} />
                <Cell fill={STATUS_COLORS.pending} />
                <Cell fill={STATUS_COLORS.rejected} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {hasAcademicData && (
        <Card>
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={academicData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="CGPA" name="CGPA" fill="#8B0000" />
                <Bar dataKey="SGPA" name="SGPA" fill="#1E88E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentStats;
