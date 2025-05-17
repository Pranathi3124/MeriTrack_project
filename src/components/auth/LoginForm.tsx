import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "@/lib/firebase";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserProfile } from "@/lib/firebase";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<"student" | "faculty" | "admin">("student");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // The issue is here - Firebase's signIn returns a UserCredential where the user is directly accessible
      const user = await signIn(data.email, data.password);
      
      // Get the user ID directly from the user object 
      const userId = user.uid;
      
      // Get user profile from Firestore to determine role
      const userProfile = await getUserProfile(userId);
      
      if (userProfile) {
        const userRole = userProfile.role;
        
        toast.success("Login successful!");
        
        // Redirect based on user role
        switch (userRole) {
          case "student":
            navigate("/student/dashboard");
            break;
          case "faculty":
            navigate("/faculty/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error("User profile not found. Please contact support.");
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Provide more specific error messages
      if (error.code === 'auth/missing-permissions' || error.code === 'permission-denied') {
        toast.error("Authentication error: Missing or insufficient permissions. Please contact support.");
      } else if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email address.");
      } else if (error.code === 'auth/wrong-password') {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid credentials. Please check your email and password.");
      } else {
        toast.error(error.message || "Failed to login. Please check your credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate placeholder based on selected role
  const getEmailPlaceholder = () => {
    switch (role) {
      case "student":
        return "e.g., 24075A0501@vnrvjiet.in";
      case "faculty":
        return "e.g., faculty@vnrvjiet.in";
      case "admin":
        return "admin@vnrvjiet.in";
      default:
        return "Enter your email";
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-t-4 border-t-college-maroon shadow-md">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center items-center mb-2">
            <img 
              src="/logo.png" 
              alt="MeriTrack Logo" 
              className="h-16 w-auto"
            />
            <h1 className="text-2xl font-bold text-college-maroon ml-2">MeriTrack</h1>
          </div>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="student" 
            onValueChange={(value) => setRole(value as "student" | "faculty" | "admin")}
            className="w-full mb-6"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">College Email</Label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder={getEmailPlaceholder()}
                          type="email"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-college-maroon hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-college-maroon hover:bg-college-darkmaroon"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6 pt-2">
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-college-maroon hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
