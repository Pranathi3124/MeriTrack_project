
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Search, Filter, RefreshCcw, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getAuditLogs } from "@/lib/firebase";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

const AuditLogsPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    action: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });
  
  const fetchLogs = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const logsData = await getAuditLogs(filters);
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  const handleFilterChange = (name: string, value: string | Date | undefined) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleApplyFilters = () => {
    fetchLogs();
  };
  
  const handleResetFilters = () => {
    setFilters({
      action: "",
      startDate: undefined,
      endDate: undefined
    });
    
    // Reset search
    setSearch("");
    
    // Fetch logs without filters
    getAuditLogs({}).then((logsData) => {
      setLogs(logsData);
    });
  };
  
  const getActionLabel = (action: string) => {
    switch (action) {
      case "login":
        return "Login";
      case "user_created":
        return "User Created";
      case "user_deleted":
        return "User Deleted";
      case "achievement_created":
        return "Achievement Created";
      case "achievement_approved":
        return "Achievement Approved";
      case "achievement_rejected":
        return "Achievement Rejected";
      default:
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };
  
  const filteredLogs = logs.filter((log) => {
    const searchLower = search.toLowerCase();
    const logContainsSearch = 
      (log.action && log.action.toLowerCase().includes(searchLower)) || 
      (log.userId && log.userId.toLowerCase().includes(searchLower)) || 
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower));
    
    return logContainsSearch;
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Security Audit Logs</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={fetchLogs}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <div className="md:col-span-5">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Filter Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select
                    value={filters.action}
                    onValueChange={(value) => handleFilterChange("action", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All actions</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="user_created">User Created</SelectItem>
                      <SelectItem value="user_deleted">User Deleted</SelectItem>
                      <SelectItem value="achievement_created">Achievement Created</SelectItem>
                      <SelectItem value="achievement_approved">Achievement Approved</SelectItem>
                      <SelectItem value="achievement_rejected">Achievement Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate ? format(filters.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) => handleFilterChange("startDate", date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate ? format(filters.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) => handleFilterChange("endDate", date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="md:col-span-2 flex space-x-2">
                  <Button 
                    onClick={handleApplyFilters}
                    className="bg-college-maroon hover:bg-college-darkmaroon"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleResetFilters}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-5">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg">Loading audit logs...</p>
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              {log.timestamp instanceof Timestamp
                                ? format(log.timestamp.toDate(), "PPP 'at' p")
                                : log.timestamp
                                  ? format(new Date(log.timestamp), "PPP 'at' p")
                                  : "N/A"}
                            </TableCell>
                            <TableCell className="font-medium">
                              {getActionLabel(log.action)}
                            </TableCell>
                            <TableCell>{log.userId}</TableCell>
                            <TableCell>{log.ipAddress || "Unknown"}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {log.details ? JSON.stringify(log.details) : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-gray-500">No audit logs found</p>
                            {search && (
                              <p className="text-sm text-gray-400 mt-2">
                                Try adjusting your search query
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
