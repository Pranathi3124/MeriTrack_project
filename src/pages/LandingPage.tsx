
import React, { useState, useEffect } from "react";
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
  Shield,
  ArrowRight,
  CheckCircle,
  UserPlus,
  GraduationCap,
  Award,
  Globe,
  ChevronRight,
  Star,
  Target,
  Sparkles
} from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    const sections = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Campus Photo */}
      <section className="relative pt-20 pb-28 lg:pt-24 lg:pb-32 text-white overflow-hidden">
        {/* Campus Photo Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/da3a3ac1-3093-46ef-9992-3e8fca975445.png" 
            alt="VNRVJIET Campus" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-college-maroon/90"></div>
        </div>
        
        {/* Animated elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="space-y-8">              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slideUp">
                Track & Showcase Your <span className="relative inline-block">
                  Academic 
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 558 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 9C1 9 155 1 279 1C403 1 557 9 557 9" stroke="#6366F1" strokeWidth="10" strokeLinecap="round"/>
                  </svg>
                </span> Excellence
              </h1>
              
              <p className="text-xl text-white/90 animate-slideUp animation-delay-300">
                A comprehensive platform that elevates your academic journey by documenting achievements, extracurricular activities, and professional development.
              </p>
              
              <div className="flex flex-wrap gap-4 animate-slideUp animation-delay-500">
                <Button 
                  asChild
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 text-base rounded-xl shadow-lg shadow-indigo-900/30 border border-indigo-500/30 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/signup" className="flex items-center gap-2">
                    Get Started <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 px-6 py-6 text-base rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Link to="/about" className="flex items-center gap-2">
                    Learn More <ChevronRight size={18} />
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center pt-4 text-white/90 animate-slideUp animation-delay-700">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white/90 flex items-center justify-center text-xs font-medium text-indigo-600">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="ml-3">Join 2000+ students already using MeriTrack</span>
              </div>
            </div>
            
            <div className="relative mt-8 md:mt-0 hidden md:block animate-slideLeft">
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
              <div className="absolute top-0 -left-4 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>
              <div className="relative p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl rotate-1 shadow-2xl">
                <div className="bg-white p-1 rounded-xl overflow-hidden rotate-0">
                  <img 
                    src="/lovable-uploads/09ca2645-762c-4dc5-855e-517732e69837.png" 
                    alt="MeriTrack Platform Preview" 
                    className="w-full h-auto rounded-lg shadow-inner"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-tr from-black/10 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pb-8 border-t border-white/10 pt-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
              {['Trusted by', 'NITs', 'IITs', 'VNR VJIET', 'CBIT', 'MGIT'].map((item, i) => (
                <div key={i} className={`flex items-center justify-center ${i === 0 ? 'text-white/60 text-sm' : 'text-white font-semibold text-xl'} animate-fadeIn animation-delay-${i*100}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white"></div>
      </section>
      
      {/* Features Section with Interactive Cards */}
      <section className="py-20 px-6 bg-white relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700 mb-4">
              <Trophy size={16} className="mr-1" /> Key Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Students & Faculty Choose MeriTrack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive tools for documenting, verifying, and showcasing academic and extracurricular achievements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle size={24} className="text-green-500" />,
                title: "Achievement Verification",
                description: "All achievements are verified by faculty members, ensuring credibility and authenticity for your portfolio."
              },
              {
                icon: <Target size={24} className="text-blue-500" />,
                title: "Comprehensive Tracking",
                description: "Document academic achievements, sports, internships, hackathons, and extracurricular activities all in one place."
              },
              {
                icon: <Award size={24} className="text-purple-500" />,
                title: "Performance Insights",
                description: "Get valuable insights about your academic progress through interactive dashboards and visual analytics."
              }
            ].map((feature, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <div 
                    className="relative p-8 border border-gray-100 rounded-2xl bg-white shadow-lg shadow-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-on-scroll cursor-pointer"
                  >
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 blur-2xl"></div>
                    <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center mb-6 relative z-10">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-5 shadow-lg rounded-xl bg-white border-gray-100">
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg flex items-center">
                      <Sparkles size={18} className="mr-2 text-yellow-500" /> {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                    <div className="pt-2 border-t border-gray-100">
                      <Link to="/features" className="text-indigo-600 font-medium text-sm flex items-center hover:underline">
                        Learn more about this feature <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center justify-center rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700 mb-4">
              <Layers size={16} className="mr-1" /> Categories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Achievement Tracking
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Document and showcase your journey through these key categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
                title: "Academic",
                description: "Track scholarships, research papers, competitions, and exceptional grades",
                color: "bg-indigo-50 text-indigo-600",
                hover: "hover:bg-indigo-600 hover:text-white"
              },
              {
                icon: <Trophy className="h-6 w-6 text-blue-600" />,
                title: "Sports",
                description: "Document sports achievements, tournaments, medals, and athletic recognition",
                color: "bg-blue-50 text-blue-600",
                hover: "hover:bg-blue-600 hover:text-white"
              },
              {
                icon: <Briefcase className="h-6 w-6 text-teal-600" />,
                title: "Internships",
                description: "Record professional experiences, internships, and industry projects",
                color: "bg-teal-50 text-teal-600",
                hover: "hover:bg-teal-600 hover:text-white"
              },
              {
                icon: <Code className="h-6 w-6 text-purple-600" />,
                title: "Hackathons",
                description: "Showcase coding competitions, hackathons, and technical challenge wins",
                color: "bg-purple-50 text-purple-600",
                hover: "hover:bg-purple-600 hover:text-white"
              },
              {
                icon: <GraduationCap className="h-6 w-6 text-amber-600" />,
                title: "Workshops",
                description: "Track professional development through workshops, certifications and training programs",
                color: "bg-amber-50 text-amber-600",
                hover: "hover:bg-amber-600 hover:text-white"
              },
              {
                icon: <Activity className="h-6 w-6 text-pink-600" />,
                title: "Co-Curricular",
                description: "Document leadership roles, club participation, volunteer work, and cultural activities",
                color: "bg-pink-50 text-pink-600",
                hover: "hover:bg-pink-600 hover:text-white"
              }
            ].map((category, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl border border-transparent ${category.color} group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${category.hover} animate-on-scroll`}
              >
                <div className="bg-white rounded-xl p-3 w-fit mb-6 shadow-sm group-hover:bg-white/20">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                <p className="group-hover:text-white/90">{category.description}</p>
                
                <div className="mt-6 pt-4 border-t border-current border-opacity-20 flex justify-between items-center">
                  <span className="font-medium">Learn more</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 mb-4">
              <Star size={16} className="mr-1" /> Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who have transformed their academic journey with MeriTrack
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "MeriTrack helped me organize all my achievements in one place, making it easier to apply for internships.",
                name: "Arjun Sharma",
                role: "CSE Student, 3rd Year",
                avatar: "AS"
              },
              {
                quote: "As a faculty advisor, this platform makes it so much easier to verify and track student performance across semesters.",
                name: "Dr. Priya Reddy",
                role: "Associate Professor, IT Department",
                avatar: "PR"
              },
              {
                quote: "The visual dashboard helps me identify my strengths and areas where I need to focus more effort.",
                name: "Meera Patel",
                role: "ECE Student, 4th Year",
                avatar: "MP"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/20 bg-white hover:shadow-xl transition-all duration-300 animate-on-scroll"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-college-maroon text-white flex items-center justify-center text-lg font-medium">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 px-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-3 py-1 text-sm text-white mb-6 backdrop-blur-sm">
              <UserPlus size={16} className="mr-1" /> Join Today
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Showcase Your Achievements?</h2>
            <p className="text-xl mb-10 text-white/90">
              Join thousands of students who are building their academic portfolios for future success.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-900/20"
              >
                <Link to="/signup" className="flex items-center gap-2">
                  Create Free Account <ArrowRight size={20} />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl"
              >
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-12">
            <div className="col-span-1 lg:col-span-1">
              <h3 className="text-2xl font-bold mb-6">MeriTrack</h3>
              <p className="text-gray-400 mb-6">
                A comprehensive platform for tracking and showcasing student achievements and academic growth.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                {['Home', 'About', 'Features', 'Pricing', 'Contact'].map(link => (
                  <li key={link}>
                    <Link to="/" className="hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                {['Blog', 'Documentation', 'Help Center', 'Privacy Policy', 'Terms of Service'].map(resource => (
                  <li key={resource}>
                    <Link to="/" className="hover:text-white transition-colors">
                      {resource}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <address className="not-italic text-gray-400 space-y-3">
                <p>Email: support@meritrack.edu</p>
                <p>Phone: +91 1234567890</p>
                <p>Address: VNRVJIET Campus, Hyderabad</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} MeriTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Add animation keyframes to your CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease forwards;
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.8s ease forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}} />
    </div>
  );
};

export default LandingPage;

