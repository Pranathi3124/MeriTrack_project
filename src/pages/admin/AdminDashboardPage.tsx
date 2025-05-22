
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPen, Users, BookOpen, Medal, Activity, FileText, Clock } from "lucide-react";
import { getAllUsers, addAuditLog, getAuditLogs } from "@/lib/firebase";
import UserManagement from "@/components/admin/UserManagement";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const AdminDashboardPage = () => {
  const { userData } = useAuth();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch audit logs when the component mounts
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const logs = await getAuditLogs({ limit: 10 });
        setAuditLogs(logs);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  // Card colors for better visual appeal
  const cardColors = [
    "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
    "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
    "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
  ];

  const iconColors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-amber-500"
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-college-gray">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className={`${cardColors[0]} transition-transform hover:scale-105`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className={`h-5 w-5 ${iconColors[0]}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">345</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card className={`${cardColors[1]} transition-transform hover:scale-105`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <UserPen className={`h-5 w-5 ${iconColors[1]}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>
        <Card className={`${cardColors[2]} transition-transform hover:scale-105`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <BookOpen className={`h-5 w-5 ${iconColors[2]}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Engineering branches</p>
          </CardContent>
        </Card>
        <Card className={`${cardColors[3]} transition-transform hover:scale-105`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Medal className={`h-5 w-5 ${iconColors[3]}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">743</div>
            <p className="text-xs text-muted-foreground">+83 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="student-management" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 overflow-x-auto pb-2 justify-start">
          <TabsTrigger value="student-management">Student Management</TabsTrigger>
          <TabsTrigger value="faculty-management">Faculty Management</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="system-status">System Status</TabsTrigger>
        </TabsList>
        <TabsContent value="student-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagement role="student" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faculty-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagement role="faculty" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-college-maroon"></div>
                </div>
              ) : auditLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.userId}</TableCell>
                          <TableCell>
                            {log.timestamp && log.timestamp.toDate ? 
                              format(log.timestamp.toDate(), 'MMM dd, yyyy HH:mm') : 
                              'N/A'}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {typeof log.details === 'object' ? 
                              JSON.stringify(log.details).substring(0, 50) + '...' : 
                              String(log.details).substring(0, 50)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-6">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-lg font-semibold">No audit logs found</p>
                  <p className="text-sm text-gray-500">Audit logs will appear here when users perform actions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system-status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>Database: Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>Authentication: Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>Storage: Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
