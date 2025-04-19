
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Achievement } from "@/lib/firebase";

interface StudentStatsProps {
  achievements: Achievement[];
}

const StudentStats: React.FC<StudentStatsProps> = ({ achievements }) => {
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
  const totalAchievements = achievements.length;

  const emptyStatusData = [
    { name: 'Pending', value: 0 },
    { name: 'Approved', value: 0 },
    { name: 'Rejected', value: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Statistics ({totalAchievements} total)</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={totalAchievements ? statusData : emptyStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {(totalAchievements ? statusData : emptyStatusData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudentStats;
