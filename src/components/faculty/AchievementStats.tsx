
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Achievement } from "@/lib/firebase";

type AchievementStatProps = {
  achievements: Achievement[];
};

const AchievementStats: React.FC<AchievementStatProps> = ({ achievements }) => {
  // Branch statistics
  const branchCounts: Record<string, number> = {};
  achievements.forEach(achievement => {
    const branch = achievement.branch || 'Unknown';
    branchCounts[branch] = (branchCounts[branch] || 0) + 1;
  });

  const branchData = Object.entries(branchCounts).map(([branch, count]) => ({
    name: branch,
    value: count,
  }));

  // Year statistics
  const yearCounts: Record<string, number> = {};
  achievements.forEach(achievement => {
    const year = achievement.year || 'Unknown';
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  const yearData = Object.entries(yearCounts).map(([year, count]) => ({
    name: year === 'Unknown' ? 'Unknown' : `Year ${year}`,
    count,
  }));

  // Status statistics
  const statusCounts = {
    pending: achievements.filter(a => a.status === 'pending').length,
    approved: achievements.filter(a => a.status === 'approved').length,
    rejected: achievements.filter(a => a.status === 'rejected').length,
  };

  const statusData = [
    { name: 'Pending', value: statusCounts.pending },
    { name: 'Approved', value: statusCounts.approved },
    { name: 'Rejected', value: statusCounts.rejected },
  ];

  const COLORS = ['#FFBB28', '#00C49F', '#FF8042'];

  // If no achievements, show a message
  if (achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white rounded-lg shadow p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-medium mb-2">No achievements found</h3>
        <p className="text-gray-500 text-center">
          No achievements match your current filter criteria.
          <br />Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievements by Year ({achievements.length} achievements)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yearData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Achievements" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements by Status ({achievements.length} achievements)</CardTitle>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          <CardTitle>Achievements by Branch ({achievements.length} achievements)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={branchData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Achievements" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementStats;
