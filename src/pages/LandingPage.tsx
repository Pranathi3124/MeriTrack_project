
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { 
  BookOpen, 
  Trophy, 
  Briefcase, 
  Code, 
  Layers, 
  Activity, 
  BarChart4, 
  Shield 
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-gradient-to-b from-white to-gray-100 py-20 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl font-bold text-college-maroon">
                Track, Showcase, and Celebrate Student Excellence
              </h1>
              <p className="text-xl text-gray-600">
                MeriTrack is a comprehensive platform for recording and showcasing students' academic achievements, extracurricular activities, and professional development.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild
                  className="bg-college-maroon hover:bg-college-darkmaroon text-white px-8 py-6 text-lg"
                >
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-college-maroon text-college-maroon hover:bg-college-maroon hover:text-white px-8 py-6 text-lg"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/lovable-uploads/09ca2645-762c-4dc5-855e-517732e69837.png" 
                alt="MeriTrack College Logo" 
                className="w-3/4 mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-college-maroon">
            Comprehensive Achievement Categories
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow achievement-card">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-college-maroon" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Academic</h3>
              </div>
              <p className="text-gray-600">
                Track academic accomplishments including scholarships, research papers, competitions, and exceptional grades.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow achievement-card">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Sports</h3>
              </div>
              <p className="text-gray-600">
                Document sports achievements, team participation, tournaments, medals, and athletic recognition.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow achievement-card">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Internships</h3>
              </div>
              <p className="text-gray-600">
                Record professional experiences, internships, industry projects, and work accomplishments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow achievement-card">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Hackathons</h3>
              </div>
              <p className="text-gray-600">
                Showcase coding competitions, hackathon participation, projects, and technical challenge wins.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow achievement-card">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Layers className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Workshops</h3>
              </div>
              <p className="text-gray-600">
                Track professional development through workshops, certifications, training programs and seminars.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow achievement-card">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Co-Curricular</h3>
              </div>
              <p className="text-gray-600">
                Document leadership roles, club participation, volunteer work, cultural activities, and more.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-college-maroon">
            Features for Every Role
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-college-maroon rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mt-4">Students</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Upload and document achievements
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Manage personal profile
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Track progress with visual dashboards
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <BarChart4 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mt-4">Faculty</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Review student achievements
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Filter by branch, year, or category
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Generate performance insights
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mt-4">Administrators</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Manage students and faculty
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Generate comprehensive reports
                </li>
                <li className="flex items-center">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Monitor system security and logs
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">MeriTrack</h4>
              <p className="text-gray-300">
                A comprehensive platform for tracking and showcasing student achievements and academic growth.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">Contact</h4>
              <address className="not-italic text-gray-300">
                <p>Email: support@meritrack.edu</p>
                <p>Phone: +91 1234567890</p>
                <p>Address: VNRVJIET Campus, Hyderabad</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MeriTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
