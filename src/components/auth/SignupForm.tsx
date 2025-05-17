import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { signUp } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format").refine(
    (email) => /^\d{5}A\d{4}@vnrvjiet\.in$/.test(email),
    "Student email must be in format: 12345A6789@vnrvjiet.in"
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  rollNo: z.string().min(1, "Roll number is required"),
  branch: z.string().min(1, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  mobileNo: z.string().min(10, "Mobile number must be at least 10 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format").refine(
    (email) => email.endsWith("@vnrvjiet.in"),
    "Faculty email must end with @vnrvjiet.in"
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  branch: z.string().min(1, "Branch is required"),
  mobileNo: z.string().min(10, "Mobile number must be at least 10 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const adminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format").refine(
    (email) => email.endsWith("@vnrvjiet.in"),
    "Admin email must end with @vnrvjiet.in"
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  mobileNo: z.string().min(10, "Mobile number must be at least 10 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const branchOptions = [
  { value: "CSE", label: "Computer Science Engineering" },
  { value: "IT", label: "Information Technology" },
  { value: "ECE", label: "Electronics and Communication Engineering" },
  { value: "EEE", label: "Electrical and Electronics Engineering" },
  { value: "MECH", label: "Mechanical Engineering" },
  { value: "CIVIL", label: "Civil Engineering" }
];

const yearOptions = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" }
];

const SignupForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "faculty" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rollNo: "",
      branch: "",
      year: "",
      mobileNo: "",
    },
  });

  const facultyForm = useForm<z.infer<typeof facultySchema>>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      branch: "",
      mobileNo: "",
    },
  });

  const adminForm = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNo: "",
    },
  });

  const onSubmitStudent = async (values: z.infer<typeof studentSchema>) => {
    setIsLoading(true);
    try {
      console.log("Student signup with values:", values);
      const { confirmPassword, ...userData } = values;

      try {
        const user = await signUp(values.email, values.password, "student", userData);
        console.log("User created successfully:", user);
        toast.success("Account created successfully!");
        navigate("/login");
      } catch (signupError: any) {
        console.error("Signup error from Firebase:", signupError);
        if (signupError.code === "auth/email-already-in-use") {
          toast.error("Email is already in use. Please use a different email or login instead.");
        } else {
          toast.error(signupError.message || "Failed to create account");
        }
      }
    } catch (error: any) {
      console.error("Signup general error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitFaculty = async (values: z.infer<typeof facultySchema>) => {
    setIsLoading(true);
    try {
      console.log("Faculty signup with values:", values);
      const { confirmPassword, ...userData } = values;

      try {
        const user = await signUp(values.email, values.password, "faculty", userData);
        console.log("Faculty user created successfully:", user);
        toast.success("Faculty account created successfully!");
        navigate("/login");
      } catch (signupError: any) {
        console.error("Faculty signup error from Firebase:", signupError);
        if (signupError.code === "auth/email-already-in-use") {
          toast.error("Email is already in use. Please use a different email or login instead.");
        } else {
          toast.error(signupError.message || "Failed to create faculty account");
        }
      }
    } catch (error: any) {
      console.error("Faculty signup general error:", error);
      toast.error(error.message || "Failed to create faculty account");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitAdmin = async (values: z.infer<typeof adminSchema>) => {
    setIsLoading(true);
    try {
      console.log("Admin signup with values:", values);
      const { confirmPassword, ...userData } = values;

      try {
        const user = await signUp(values.email, values.password, "admin", userData);
        console.log("Admin user created successfully:", user);
        toast.success("Admin account created successfully!");
        navigate("/login");
      } catch (signupError: any) {
        console.error("Admin signup error from Firebase:", signupError);
        if (signupError.code === "auth/email-already-in-use") {
          toast.error("Email is already in use. Please use a different email or login instead.");
        } else {
          toast.error(signupError.message || "Failed to create admin account");
        }
      }
    } catch (error: any) {
      console.error("Admin signup general error:", error);
      toast.error(error.message || "Failed to create admin account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <Card className="w-full max-w-xl border-t-4 border-t-college-maroon shadow-lg animate-fade-in">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-college-gray animate-slide-in-right">Create Account</CardTitle>
          <CardDescription className="animate-fade-in">
            Fill in your details to create your account
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="student" onValueChange={(v) => setRole(v as any)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 mx-4 animate-fade-in">
            <TabsTrigger value="student" className="transition-all duration-300 hover:bg-college-maroon hover:text-white">Student</TabsTrigger>
            <TabsTrigger value="faculty" className="transition-all duration-300 hover:bg-college-maroon hover:text-white">Faculty</TabsTrigger>
            <TabsTrigger value="admin" className="transition-all duration-300 hover:bg-college-maroon hover:text-white">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student" className="animate-scale-in">
            <CardContent>
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(onSubmitStudent)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={studentForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                          <FormLabel>College Email</FormLabel>
                          <FormControl>
                            <Input placeholder="12345A6789@vnrvjiet.in" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={studentForm.control}
                      name="rollNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roll Number</FormLabel>
                          <FormControl>
                            <Input placeholder="24075A0501" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="mobileNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={studentForm.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branchOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {yearOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={studentForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="********" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-college-maroon hover:bg-college-darkmaroon transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="faculty">
            <CardContent>
              <Form {...facultyForm}>
                <form onSubmit={facultyForm.handleSubmit(onSubmitFaculty)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={facultyForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={facultyForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Faculty Email</FormLabel>
                          <FormControl>
                            <Input placeholder="faculty@vnrvjiet.in" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={facultyForm.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department/Branch</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branchOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={facultyForm.control}
                      name="mobileNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={facultyForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="********" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={facultyForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-college-maroon hover:bg-college-darkmaroon"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="admin">
            <CardContent>
              <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit(onSubmitAdmin)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={adminForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Email</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@vnrvjiet.in" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={adminForm.control}
                    name="mobileNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="********" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={adminForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-college-maroon hover:bg-college-darkmaroon"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-4 mt-2 animate-fade-in">
          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-college-maroon hover:text-college-darkmaroon font-medium transition-colors duration-300 hover:underline">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupForm;
