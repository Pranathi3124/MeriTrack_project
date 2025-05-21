
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getAllAchievements, Achievement } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";
import AchievementReviewCard from "./AchievementReviewCard";
import AchievementAnalytics from "../analytics/AchievementAnalytics";
import { Timestamp } from "firebase/firestore";

const FacultyAchievementDashboard = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    status: "all",
    branch: "all",
    year: "all"
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [achievements, filters]);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const allAchievements = await getAllAchievements();
      setAchievements(allAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Failed to load achievements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...achievements];

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(a => a.category === filters.category);
    }

    if (filters.level && filters.level !== "all") {
      filtered = filtered.filter(a => a.level === filters.level);
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(a => a.status === filters.status);
    }

    if (filters.branch && filters.branch !== "all") {
      filtered = filtered.filter(a => a.branch === filters.branch);
    }

    if (filters.year && filters.year !== "all") {
      filtered = filtered.filter(a => a.year === filters.year);
    }

    setFilteredAchievements(filtered);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      level: "all",
      status: "all",
      branch: "all",
      year: "all"
    });
  };

  const downloadCSV = () => {
    // Create CSV header
    const headers = [
      'Title',
      'Category',
      'Level',
      'Student Name',
      'Branch',
      'Year',
      'Date',
      'Status',
      'Description'
    ].join(',');

    // Create CSV rows
    const rows = filteredAchievements.map(a => {
      // Handle date conversion properly
      let formattedDate = '';
      if (a.date instanceof Date) {
        formattedDate = a.date.toLocaleDateString();
      } else if (a.date instanceof Timestamp) {
        formattedDate = a.date.toDate().toLocaleDateString();
      } else if (a.date) {
        // Try to convert from string or number if needed
        formattedDate = new Date(a.date).toLocaleDateString();
      }
      
      return [
        `"${a.title.replace(/"/g, '""')}"`,
        a.category,
        a.level || 'N/A',
        `"${a.studentName}"`,
        a.branch,
        a.year,
        formattedDate,
        a.status,
        `"${a.description?.replace(/"/g, '""') || ''}"`
      ].join(',');
    });

    // Combine header and rows
    const csv = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `achievement-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Achievement Dashboard</h2>
          <p className="text-muted-foreground">
            Track, analyze, and manage student achievements
          </p>
        </div>
        <Button
          onClick={downloadCSV}
          className="mt-4 sm:mt-0 bg-college-maroon hover:bg-college-darkmaroon"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="review">
            Review Achievements
            <Badge variant="secondary" className="ml-2 bg-college-maroon text-white">
              {achievements.filter(a => a.status === 'pending').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-maroon"></div>
            </div>
          ) : (
            <AchievementAnalytics achievements={achievements} />
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="academic">Academic Excellence</SelectItem>
                      <SelectItem value="technical">Technical Skills</SelectItem>
                      <SelectItem value="research">Research & Projects</SelectItem>
                      <SelectItem value="competition">Competitions</SelectItem>
                      <SelectItem value="extra-curricular">Extra-Curricular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Level</Label>
                  <Select
                    value={filters.level}
                    onValueChange={(value) => handleFilterChange('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="college">College Level</SelectItem>
                      <SelectItem value="state">State/Regional Level</SelectItem>
                      <SelectItem value="national">National Level</SelectItem>
                      <SelectItem value="international">International Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Branch</Label>
                  <Select
                    value={filters.branch}
                    onValueChange={(value) => handleFilterChange('branch', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      <SelectItem value="CSE">Computer Science</SelectItem>
                      <SelectItem value="IT">Information Technology</SelectItem>
                      <SelectItem value="ECE">Electronics & Communication</SelectItem>
                      <SelectItem value="EEE">Electrical & Electronics</SelectItem>
                      <SelectItem value="MECH">Mechanical</SelectItem>
                      <SelectItem value="CIVIL">Civil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Year</Label>
                  <Select
                    value={filters.year}
                    onValueChange={(value) => handleFilterChange('year', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-5 flex justify-end">
                  <Button variant="outline" onClick={resetFilters} className="mr-2">
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-college-maroon"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((achievement) => (
                  <AchievementReviewCard 
                    key={achievement.id} 
                    achievement={{
                      id: achievement.id,
                      title: achievement.title,
                      category: achievement.category,
                      description: achievement.description,
                      date: achievement.date,
                      documentURL: achievement.documentUrl,
                      documentName: achievement.documentUrl?.split('/').pop() || '',
                      status: achievement.status,
                      createdAt: achievement.createdAt instanceof Timestamp 
                        ? achievement.createdAt 
                        : Timestamp.fromDate(achievement.createdAt instanceof Date 
                            ? achievement.createdAt 
                            : new Date()),
                      studentName: achievement.studentName,
                      studentEmail: achievement.studentEmail,
                      rollNo: achievement.rollNo,
                      branch: achievement.branch,
                      year: achievement.year
                    }}
                    onStatusUpdate={fetchAchievements} 
                  />
                ))
              ) : (
                <div className="lg:col-span-2 text-center py-12 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No achievements match the current filters.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyAchievementDashboard;
