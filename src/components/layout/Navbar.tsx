
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
      <div className="container mx-auto flex items-center">
        {/* Logo and College Name Section */}
        <div className="flex items-center flex-shrink-0 mr-4">
          <Link to="/" className="flex items-center">
            <Logo />
            <div className="hidden md:block ml-2 text-xs leading-tight max-w-[200px]">
              <span className="font-semibold text-college-maroon block">Vallurupalli Nageswara Rao</span>
              <span className="font-semibold text-college-maroon block">Vignana Jyothi Institute of</span>
              <span className="font-semibold text-college-maroon block">Engineering &Technology</span>
            </div>
          </Link>
        </div>
        
        {/* Central MeriTrack Navigation Brand */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-college-maroon via-college-darkmaroon to-college-maroon bg-clip-text text-transparent">
              MeriTrack
            </h1>
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-college-maroon to-transparent"></div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link 
                to={getDashboardLink()}
                className="text-gray-700 hover:text-college-maroon font-medium"
              >
                Dashboard
              </Link>
              
              {userData?.role === "admin" && (
                <>
                  <Link 
                    to="/admin/reports"
                    className="text-gray-700 hover:text-college-maroon font-medium"
                  >
                    Reports
                  </Link>
                  <Link 
                    to="/admin/audit"
                    className="text-gray-700 hover:text-college-maroon font-medium"
                  >
                    Audit Logs
                  </Link>
                </>
              )}

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
            </>
          ) : (
            <>
              <Link 
                to="/"
                className="text-gray-700 hover:text-college-maroon font-medium"
              >
                Home
              </Link>
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
              <Button 
                onClick={() => navigate("/login")}
                className="bg-college-maroon hover:bg-college-darkmaroon"
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
