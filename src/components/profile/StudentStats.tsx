
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Achievement } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, TrendingUp, Clipboard, Check, X, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface StudentStatsProps {
  achievements: Achievement[];
}

const StudentStats: React.FC<StudentStatsProps> = ({ achievements }) => {
  const [chartView, setChartView] = useState<"pie" | "bar">("pie");
  
  const statusCounts = {
    pending: achievements.filter(a => a.status === 'pending').length,
    approved: achievements.filter(a => a.status === 'approved').length,
    rejected: achievements.filter(a => a.status === 'rejected').length,
  };

  const categoryMap: Record<string, number> = {};
  achievements.forEach(achievement => {
    const category = achievement.category;
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const statusData = [
    { name: 'Pending', value: statusCounts.pending },
    { name: 'Approved', value: statusCounts.approved },
    { name: 'Rejected', value: statusCounts.rejected },
  ];

  // Using more distinct colors to avoid overlap in the legend
  const STATUS_COLORS = ['#FFBB28', '#00C49F', '#FF5252'];
  const CATEGORY_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042'];

  const totalAchievements = achievements.length;
  const approvedPercentage = totalAchievements ? Math.round((statusCounts.approved / totalAchievements) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={cardVariants}>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-700">
              <Award className="mr-2 h-5 w-5 text-indigo-500" />
              Achievement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="rounded-lg bg-white p-4 shadow-sm flex flex-col items-center justify-center"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-amber-100 mb-2">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-amber-500">{statusCounts.pending}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </motion.div>
              
              <motion.div 
                className="rounded-lg bg-white p-4 shadow-sm flex flex-col items-center justify-center"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 mb-2">
                  <Check className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold text-emerald-500">{statusCounts.approved}</div>
                <div className="text-sm text-gray-500">Approved</div>
              </motion.div>
              
              <motion.div 
                className="rounded-lg bg-white p-4 shadow-sm flex flex-col items-center justify-center"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-rose-100 mb-2">
                  <X className="h-6 w-6 text-rose-500" />
                </div>
                <div className="text-3xl font-bold text-rose-500">{statusCounts.rejected}</div>
                <div className="text-sm text-gray-500">Rejected</div>
              </motion.div>
            </div>

            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-1">
                <motion.div 
                  className="bg-indigo-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${approvedPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>Overall Progress</span>
                <span className="font-medium">{approvedPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center text-purple-700">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
                Achievement Analysis
              </span>
              <Tabs defaultValue="pie" className="w-[200px]" onValueChange={(value) => setChartView(value as "pie" | "bar")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartView === "pie" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    {totalAchievements > 0 && <Tooltip formatter={(value) => [`${value} achievements`, "Count"]} />}
                    {totalAchievements > 0 && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData.length ? categoryData : [{ name: "No data", value: 0 }]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Count" barSize={20}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            {!totalAchievements && (
              <div className="text-center text-gray-500 mt-4">
                No achievements data available yet. Add achievements to see your statistics.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {totalAchievements > 0 && (
        <motion.div variants={cardVariants}>
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-700">
                <Clipboard className="mr-2 h-5 w-5 text-teal-500" />
                Achievement Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(categoryMap).map(([category, count], index) => (
                  <motion.div 
                    key={category}
                    className="bg-white rounded-lg p-4 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-700 capitalize">{category}</h3>
                      <span className="text-xl font-bold text-teal-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <motion.div 
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / totalAchievements) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    <div className="text-xs text-right text-gray-500 mt-1">
                      {Math.round((count / totalAchievements) * 100)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentStats;
