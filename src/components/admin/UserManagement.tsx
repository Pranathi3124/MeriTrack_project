
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, getAllUsers, signUp, removeUser, addAuditLog } from "@/lib/firebase";
import { UserPlus, Trash2, Search, RefreshCcw } from "lucide-react";

type UserManagementProps = {
  role: UserRole;
};

const UserManagement: React.FC<UserManagementProps> = ({ role }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNo: "",
    branch: "",
    department: "",
    year: "",
    rollNo: "",
    designation: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  
  const fetchUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const usersData = await getAllUsers(role);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(`Failed to load ${role}s`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, user]);
  
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (newUserData.password !== newUserData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (newUserData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    let userData = {} as any;
    let email = newUserData.email;
    
    // Prepare user data based on role
    if (role === "student") {
      if (!newUserData.name || !newUserData.branch || !newUserData.year || !newUserData.rollNo) {
        toast.error("Please fill all required fields");
        return;
      }
      
      if (!email.includes("@vnrvjiet.in")) {
        email = `${newUserData.rollNo}@vnrvjiet.in`;
      }
      
      userData = {
        name: newUserData.name,
        branch: newUserData.branch,
        year: newUserData.year,
        rollNo: newUserData.rollNo,
        mobileNo: newUserData.mobileNo || ""
      };
    } else if (role === "faculty") {
      if (!newUserData.name || !newUserData.department || !newUserData.designation) {
        toast.error("Please fill all required fields");
        return;
      }
      
      if (email !== "faculty@vnrvjiet.in") {
        email = "faculty@vnrvjiet.in";
      }
      
      userData = {
        name: newUserData.name,
        department: newUserData.department,
        designation: newUserData.designation,
        mobileNo: newUserData.mobileNo || ""
      };
    } else if (role === "admin") {
      if (!newUserData.name) {
        toast.error("Please fill all required fields");
        return;
      }
      
      if (email !== "admin@vnrvjiet.in") {
        email = "admin@vnrvjiet.in";
      }
      
      userData = {
        name: newUserData.name,
        mobileNo: newUserData.mobileNo || ""
      };
    }
    
    setIsCreating(true);
    
    try {
      // Create new user
      await signUp(email, newUserData.password, role, userData);
      
      // Add audit log
      await addAuditLog("user_created", user.uid, { 
        role,
        email,
        name: newUserData.name 
      });
      
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`);
      
      // Reset form and close dialog
      setNewUserData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNo: "",
        branch: "",
        department: "",
        year: "",
        rollNo: "",
        designation: "",
      });
      setIsDialogOpen(false);
      
      // Refresh users list
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || `Failed to create ${role}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!user) return;
    
    if (!confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }
    
    try {
      await removeUser(userId);
      
      // Add audit log
      await addAuditLog("user_deleted", user.uid, { 
        role,
        userId,
        userName
      });
      
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully!`);
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`Failed to delete ${role}`);
    }
  };
  
  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.rollNo?.toLowerCase().includes(searchLower) ||
      user.branch?.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${role}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchUsers}
            className="flex-shrink-0"
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-college-maroon hover:bg-college-darkmaroon flex-shrink-0">
                <UserPlus className="h-4 w-4 mr-2" />
                Add {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New {role.charAt(0).toUpperCase() + role.slice(1)}</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new {role} account.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newUserData.name}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  
                  {role === "student" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="rollNo">Roll Number</Label>
                        <Input
                          id="rollNo"
                          name="rollNo"
                          value={newUserData.rollNo}
                          onChange={handleNewUserChange}
                          placeholder="e.g., 24075a0501"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Email will be automatically generated as rollnumber@vnrvjiet.in
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Select
                          value={newUserData.branch}
                          onValueChange={(value) => handleSelectChange("branch", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CSE">Computer Science</SelectItem>
                            <SelectItem value="IT">Information Technology</SelectItem>
                            <SelectItem value="ECE">Electronics & Communication</SelectItem>
                            <SelectItem value="EEE">Electrical & Electronics</SelectItem>
                            <SelectItem value="MECH">Mechanical</SelectItem>
                            <SelectItem value="CIVIL">Civil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="year">Year</Label>
                        <Select
                          value={newUserData.year}
                          onValueChange={(value) => handleSelectChange("year", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  {role === "faculty" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={newUserData.department}
                          onValueChange={(value) => handleSelectChange("department", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CSE">Computer Science</SelectItem>
                            <SelectItem value="IT">Information Technology</SelectItem>
                            <SelectItem value="ECE">Electronics & Communication</SelectItem>
                            <SelectItem value="EEE">Electrical & Electronics</SelectItem>
                            <SelectItem value="MECH">Mechanical</SelectItem>
                            <SelectItem value="CIVIL">Civil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Select
                          value={newUserData.designation}
                          onValueChange={(value) => handleSelectChange("designation", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                            <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                            <SelectItem value="Professor">Professor</SelectItem>
                            <SelectItem value="HOD">Head of Department</SelectItem>
                            <SelectItem value="Dean">Dean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Email will be set to faculty@vnrvjiet.in
                      </p>
                    </>
                  )}
                  
                  {role === "admin" && (
                    <p className="text-xs text-gray-500">
                      Email will be set to admin@vnrvjiet.in
                    </p>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="mobileNo">Mobile Number (Optional)</Label>
                    <Input
                      id="mobileNo"
                      name="mobileNo"
                      value={newUserData.mobileNo}
                      onChange={handleNewUserChange}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newUserData.password}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={newUserData.confirmPassword}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-college-maroon hover:bg-college-darkmaroon"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{role === "student" ? "Students" : role === "faculty" ? "Faculty" : "Administrators"}</CardTitle>
          <CardDescription>
            Manage all {role === "student" ? "students" : role === "faculty" ? "faculty" : "administrators"} in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center p-8">
              <div className="w-10 h-10 border-4 border-t-college-maroon border-r-transparent border-b-college-maroon border-l-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4">Loading users...</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    {role === "student" && (
                      <>
                        <TableHead>Roll No</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Year</TableHead>
                      </>
                    )}
                    {role === "faculty" && (
                      <>
                        <TableHead>Department</TableHead>
                        <TableHead>Designation</TableHead>
                      </>
                    )}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        {role === "student" && (
                          <>
                            <TableCell>{user.rollNo}</TableCell>
                            <TableCell>{user.branch}</TableCell>
                            <TableCell>{user.year}</TableCell>
                          </>
                        )}
                        {role === "faculty" && (
                          <>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>{user.designation}</TableCell>
                          </>
                        )}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={role === "student" ? 5 : role === "faculty" ? 4 : 3} className="text-center py-8">
                        <p className="text-gray-500">No {role}s found</p>
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
        <CardFooter className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} {role}s
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserManagement;
