
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/login/LoginPage";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";

// Faculty Pages
import FacultyDashboardPage from "./pages/faculty/FacultyDashboardPage";
import FacultyProfilePage from "./pages/faculty/FacultyProfilePage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import ReportsPage from "./pages/admin/ReportsPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Context
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Student Routes */}
            <Route path="student" element={<AppLayout requiredRole="student" />}>
              <Route path="dashboard" element={<StudentDashboardPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>
            
            {/* Faculty Routes */}
            <Route path="faculty" element={<AppLayout requiredRole="faculty" />}>
              <Route path="dashboard" element={<FacultyDashboardPage />} />
              <Route path="profile" element={<FacultyProfilePage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="admin" element={<AppLayout requiredRole="admin" />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="audit" element={<AuditLogsPage />} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
