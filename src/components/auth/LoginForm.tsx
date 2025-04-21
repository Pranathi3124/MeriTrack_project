import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { signIn, validateEmail } from "@/lib/firebase";
import { addAuditLog } from "@/lib/firebase";
import Logo from "@/components/Logo";

const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "faculty" | "admin">("student");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = validateEmail(email, role);
      console.log(`Validating email: ${email} for role: ${role}, valid: ${isValid}`);
      
      if (!isValid) {
        throw new Error(`Invalid email format for ${role} role`);
      }

      const user = await signIn(email, password);
      
      await addAuditLog("login", user.uid, { role, email });
      
      toast.success("Successfully logged in!");
      
      if (returnTo.startsWith("/")) {
        navigate(returnTo);
      } else {
        if (email === "admin@vnrvjiet.in") {
          navigate("/admin/dashboard");
        } else if (!email.match(/^\d{4}[a-zA-Z]\d{4}@vnrvjiet\.in$/)) {
          navigate("/faculty/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <Card className="w-full max-w-md border-t-4 border-t-college-maroon shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Logo className="mx-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-college-gray">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="student" onValueChange={(v) => setRole(v as any)}>
          <TabsList className="grid grid-cols-3 mb-4 mx-4">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">College Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="e.g., 24075a0501@vnrvjiet.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a 
                      href="#" 
                      className="text-sm text-college-maroon hover:text-college-lightmaroon"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-college-maroon hover:bg-college-darkmaroon"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="faculty">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty-email">Faculty Email</Label>
                  <Input 
                    id="faculty-email" 
                    type="email" 
                    placeholder="faculty@vnrvjiet.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="faculty-password">Password</Label>
                    <a 
                      href="#" 
                      className="text-sm text-college-maroon hover:text-college-lightmaroon"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="faculty-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-college-maroon hover:bg-college-darkmaroon"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="admin">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    placeholder="admin@vnrvjiet.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password">Password</Label>
                    <a 
                      href="#" 
                      className="text-sm text-college-maroon hover:text-college-lightmaroon"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="admin-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-college-maroon hover:bg-college-darkmaroon"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-4 mt-2">
          <div className="text-sm text-center text-gray-500">
            Don't have an account? <Link to="/signup" className="text-college-maroon hover:text-college-darkmaroon font-medium">Sign up</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
