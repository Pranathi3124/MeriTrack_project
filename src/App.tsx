
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Pages
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
import AboutPage from "@/pages/about/AboutPage";
import ContactPage from "@/pages/contact/ContactPage";
import FeaturesPage from "@/pages/features/FeaturesPage";
import LoginPage from "@/pages/login/LoginPage";
import SignupPage from "@/pages/signup/SignupPage";
import StudentDashboardPage from "@/pages/student/StudentDashboardPage";
import StudentProfilePage from "@/pages/student/StudentProfilePage";
import FacultyDashboardPage from "@/pages/faculty/FacultyDashboardPage";
import FacultyProfilePage from "@/pages/faculty/FacultyProfilePage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import ReportsPage from "@/pages/admin/ReportsPage";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";

// Sample emails page
import SampleEmailsPage from "@/pages/sample-emails/SampleEmailsPage";

// Layouts
import AppLayout from "@/components/layout/AppLayout";

// Auth routes
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/sample-emails" element={<SampleEmailsPage />} />

              {/* Student routes */}
              <Route path="/student" element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<StudentDashboardPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>
              
              {/* Faculty routes */}
              <Route path="/faculty" element={
                <ProtectedRoute allowedRoles={["faculty"]}>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<FacultyDashboardPage />} />
                <Route path="profile" element={<FacultyProfilePage />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="audit" element={<AuditLogsPage />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
