
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
      'extra-curricular': 'Extra-Curricular'
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
    return Object.entries(counts).map(([category, count]) => ({
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
      international: 0
    };
    
    achievements.forEach(achievement => {
      const level = achievement.level;
      if (level && counts[level] !== undefined) {
        counts[level]++;
      }
    });
    
    // Convert to array with more readable names
    return Object.entries(counts).map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count
    }));
  };
  
  const categoryData = getCategoryCounts();
  const statusData = getStatusCounts();
  const levelData = getLevelCounts();
  
  // Get achievement counts by level for different categories
  const getCategoryLevelData = () => {
    // Define all categories and levels
    const categories = {
      'academic': 'Academic Excellence',
      'technical': 'Technical Skills',
      'research': 'Research & Projects',
      'competition': 'Competitions',
      'extra-curricular': 'Extra-Curricular'
    };
    
    const levels = ['college', 'state', 'national', 'international'];
    
    // Initialize data structure
    const data = {};
    Object.keys(categories).forEach(category => {
      data[category] = {
        name: categories[category],
        college: 0,
        state: 0,
        national: 0,
        international: 0
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
    
    // Convert to array for chart
    return Object.values(data);
  };
  
  const categoryLevelData = getCategoryLevelData();
  
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
                  label={({ name, percent }) => 
                    percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Achievement Levels</CardTitle>
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
                  label={({ name, percent }) => 
                    percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                >
                  {levelData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(LEVEL_COLORS)[index % Object.values(LEVEL_COLORS).length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution by Level</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryLevelData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="college" name="College Level" fill={LEVEL_COLORS.college} />
              <Bar dataKey="state" name="State Level" fill={LEVEL_COLORS.state} />
              <Bar dataKey="national" name="National Level" fill={LEVEL_COLORS.national} />
              <Bar dataKey="international" name="International Level" fill={LEVEL_COLORS.international} />
            </BarChart>
          </ResponsiveContainer>
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
              <Tooltip />
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
    </div>
  );
};

export default StudentStats;
