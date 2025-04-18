
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { logOut } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const Navbar = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  const getProfileLink = () => {
    if (!userData) return "/";
    
    switch(userData.role) {
      case "student":
        return "/student/profile";
      case "faculty":
        return "/faculty/profile";
      case "admin":
        return "/admin/profile";
      default:
        return "/";
    }
  };

  const getDashboardLink = () => {
    if (!userData) return "/";
    
    switch(userData.role) {
      case "student":
        return "/student/dashboard";
      case "faculty":
        return "/faculty/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="border-b bg-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link 
            to="/"
            className="text-gray-700 hover:text-college-maroon font-medium"
          >
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to={getDashboardLink()}
                className="text-gray-700 hover:text-college-maroon font-medium"
              >
                Dashboard
              </Link>
              
              {userData?.role === "admin" && (
                <Link 
                  to="/admin/reports"
                  className="text-gray-700 hover:text-college-maroon font-medium"
                >
                  Reports
                </Link>
              )}
              
              {userData?.role === "admin" && (
                <Link 
                  to="/admin/audit"
                  className="text-gray-700 hover:text-college-maroon font-medium"
                >
                  Audit Logs
                </Link>
              )}
            </>
          ) : (
            <>
              <Link 
                to="/about"
                className="text-gray-700 hover:text-college-maroon font-medium"
              >
                About
              </Link>
              <Link 
                to="/contact"
                className="text-gray-700 hover:text-college-maroon font-medium"
              >
                Contact Us
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0">
                  {userData?.photoURL ? (
                    <img 
                      src={userData.photoURL} 
                      alt={userData.name} 
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-50">
                <div className="p-2 text-center">
                  <p className="font-medium">{userData?.name}</p>
                  <p className="text-sm text-gray-500">{userData?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    to={getProfileLink()}
                    className="cursor-pointer flex items-center"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to={getDashboardLink()}
                    className="cursor-pointer flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => navigate("/login")}
              className="bg-college-maroon hover:bg-college-darkmaroon"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
