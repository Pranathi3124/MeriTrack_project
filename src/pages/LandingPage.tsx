
import React, { useState } from "react";
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
  Shield,
  ArrowRight,
  CheckCircle,
  UserPlus,
  GraduationCap,
  Award,
  Globe
} from "lucide-react";

const LandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <Navbar />
      
      <section className="py-20 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
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

          {/* Bento Grid Section */}
          <div className="my-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-college-maroon">
              Why Choose MeriTrack?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Feature Card */}
              <div 
                className={`row-span-2 col-span-1 md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-college-maroon/90 to-college-darkmaroon text-white backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  hoveredCard === 0 ? 'scale-[1.02]' : ''
                }`}
                onMouseEnter={() => setHoveredCard(0)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="bg-white/20 p-3 rounded-full w-fit mb-4">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Comprehensive Achievement Tracking</h3>
                    <p className="text-lg mb-6">
                      Our platform enables students to document and showcase their complete academic journey, 
                      from classroom excellence to extracurricular achievements and professional development.
                    </p>
                  </div>
                  <Button 
                    asChild 
                    variant="secondary" 
                    className="w-fit group flex items-center bg-white text-college-maroon hover:bg-white/90"
                  >
                    <Link to="/signup">
                      Start Tracking
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Glassmorphism Cards */}
              {[
                {
                  icon: <CheckCircle />,
                  title: "Verified Achievements",
                  description: "All achievements are verified by faculty members for credibility.",
                },
                {
                  icon: <UserPlus />,
                  title: "Build Your Portfolio",
                  description: "Create a comprehensive portfolio to showcase to potential employers.",
                },
                {
                  icon: <GraduationCap />,
                  title: "Academic Growth",
                  description: "Track your academic progress and identify areas for improvement.",
                },
                {
                  icon: <Award />,
                  title: "Recognition",
                  description: "Get recognized for your hard work and achievements.",
                },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-3xl backdrop-blur-md bg-white/30 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    hoveredCard === index + 1 ? 'scale-[1.02]' : ''
                  }`}
                  onMouseEnter={() => setHoveredCard(index + 1)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="bg-college-maroon/10 p-3 rounded-full w-fit mb-4">
                    <div className="text-college-maroon">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-college-maroon">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Categories Bento Grid */}
          <div className="my-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-college-maroon">
              Comprehensive Achievement Categories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <BookOpen className="h-6 w-6 text-college-maroon" />,
                  title: "Academic",
                  description: "Track academic accomplishments including scholarships, research papers, competitions, and exceptional grades.",
                  bgColor: "bg-red-100",
                  textColor: "text-college-maroon"
                },
                {
                  icon: <Trophy className="h-6 w-6 text-blue-600" />,
                  title: "Sports",
                  description: "Document sports achievements, team participation, tournaments, medals, and athletic recognition.",
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-600"
                },
                {
                  icon: <Briefcase className="h-6 w-6 text-green-600" />,
                  title: "Internships",
                  description: "Record professional experiences, internships, industry projects, and work accomplishments.",
                  bgColor: "bg-green-100",
                  textColor: "text-green-600"
                },
                {
                  icon: <Code className="h-6 w-6 text-purple-600" />,
                  title: "Hackathons",
                  description: "Showcase coding competitions, hackathon participation, projects, and technical challenge wins.",
                  bgColor: "bg-purple-100",
                  textColor: "text-purple-600"
                },
                {
                  icon: <Layers className="h-6 w-6 text-yellow-600" />,
                  title: "Workshops",
                  description: "Track professional development through workshops, certifications, training programs and seminars.",
                  bgColor: "bg-yellow-100",
                  textColor: "text-yellow-600"
                },
                {
                  icon: <Activity className="h-6 w-6 text-orange-600" />,
                  title: "Co-Curricular",
                  description: "Document leadership roles, club participation, volunteer work, cultural activities, and more.",
                  bgColor: "bg-orange-100",
                  textColor: "text-orange-600"
                }
              ].map((category, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-sm bg-white/70 p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="flex items-center mb-4">
                    <div className={`${category.bgColor} p-3 rounded-full group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className={`text-xl font-semibold ml-3 ${category.textColor}`}>{category.title}</h3>
                  </div>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
      
          {/* Features Bento Grid */}
          <div className="my-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-college-maroon">
              Features for Every Role
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BookOpen className="h-8 w-8 text-white" />,
                  title: "Students",
                  bg: "bg-college-maroon",
                  features: [
                    "Upload and document achievements",
                    "Manage personal profile",
                    "Track progress with visual dashboards"
                  ]
                },
                {
                  icon: <BarChart4 className="h-8 w-8 text-white" />,
                  title: "Faculty",
                  bg: "bg-blue-600",
                  features: [
                    "Review student achievements",
                    "Filter by branch, year, or category",
                    "Generate performance insights"
                  ]
                },
                {
                  icon: <Shield className="h-8 w-8 text-white" />,
                  title: "Administrators",
                  bg: "bg-purple-600",
                  features: [
                    "Manage students and faculty",
                    "Generate comprehensive reports",
                    "Monitor system security and logs"
                  ]
                }
              ].map((role, index) => (
                <div 
                  key={index} 
                  className="backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 border border-white/60"
                >
                  <div className="text-center mb-6">
                    <div className={`mx-auto w-16 h-16 ${role.bg} rounded-full flex items-center justify-center`}>
                      {role.icon}
                    </div>
                    <h3 className="text-xl font-semibold mt-4">{role.title}</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div className="bg-green-100 p-1 rounded-full mr-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="my-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-college-maroon to-college-lightmaroon backdrop-blur-xl text-white border border-white/20 shadow-lg">
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Showcase Your Achievements?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join MeriTrack today and start building your comprehensive achievement portfolio for future success.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-college-maroon hover:bg-gray-100 px-8 py-6"
                >
                  <Link to="/signup">Sign Up Now</Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/20 px-8 py-6"
                >
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
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
