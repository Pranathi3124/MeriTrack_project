import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, CheckCircle, Award, BookOpen, GraduationCap, Trophy, UserPlus } from "lucide-react";

const AboutPage = () => {
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-college-maroon/90 via-college-darkmaroon to-college-maroon pt-20 pb-16 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About MeriTrack</h1>
            <p className="text-xl text-white/80">
              Building the bridge between academic excellence and professional success
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center animate-on-scroll">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                MeriTrack was born out of a simple observation: students put tremendous effort into their academic and extracurricular achievements, but these accomplishments often remain scattered across certificates, emails, and personal records.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Founded in 2023 by a team of educators and tech enthusiasts from VNRVJIET, we set out to create a platform that would help students document, verify, and showcase their journey through college in a meaningful way.
              </p>
              <p className="text-lg text-gray-700">
                Today, MeriTrack serves thousands of students across engineering colleges in India, helping them build comprehensive portfolios that stand out to potential employers and graduate programs.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Students collaborating on academic achievements" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-college-maroon rounded-full opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-college-maroon rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-xl text-gray-700">
              To empower students to take control of their academic narratives and build verifiable portfolios that highlight their unique journey through higher education.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 animate-on-scroll">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-college-maroon" />,
                title: "Document",
                description: "Provide a centralized platform for students to record all their academic and extracurricular achievements."
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-college-maroon" />,
                title: "Verify",
                description: "Enable faculty to verify student achievements, adding credibility and authenticity to their portfolios."
              },
              {
                icon: <Trophy className="h-8 w-8 text-college-maroon" />,
                title: "Showcase",
                description: "Offer tools for students to present their verified achievements to potential employers and institutions."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-college-maroon/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why We're Different */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why We're Different</h2>
            <p className="text-xl text-gray-700">
              MeriTrack isn't just another portfolio tool - it's a comprehensive ecosystem designed specifically for the Indian higher education context.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 animate-on-scroll">
            {[
              {
                title: "Built for Indian Education",
                description: "Designed specifically for the unique structure and requirements of Indian engineering and professional colleges."
              },
              {
                title: "Faculty Verification",
                description: "Every achievement is verified by faculty members, adding credibility that self-reported portfolios simply can't match."
              },
              {
                title: "Comprehensive Categories",
                description: "From academic excellence to sports achievements, internships to cultural activities - we track it all in one place."
              },
              {
                title: "Insight-Driven Growth",
                description: "Advanced analytics help students identify their strengths and areas for improvement throughout their academic journey."
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-college-maroon text-white flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  {item.title}
                </h3>
                <p className="text-gray-600 ml-11">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Meet Our Team</h2>
            <p className="text-xl text-gray-700">
              A dedicated group of educators, technologists, and student advocates working to transform how achievements are tracked and recognized.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 animate-on-scroll">
            {[
              {
                name: "Dr. Arun Kumar",
                role: "Founder & Director",
                avatar: "AK"
              },
              {
                name: "Priya Sharma",
                role: "Head of Product",
                avatar: "PS"
              },
              {
                name: "Vikram Reddy",
                role: "Chief Technology Officer",
                avatar: "VR"
              },
              {
                name: "Meera Patel",
                role: "Student Success Manager",
                avatar: "MP"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 rounded-full bg-college-maroon text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Join Us CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-college-darkmaroon via-college-maroon to-college-lightmaroon text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-3 py-1 text-sm text-white mb-6 backdrop-blur-sm">
              <UserPlus size={16} className="mr-1" /> Be Part of Our Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join MeriTrack Today</h2>
            <p className="text-xl mb-10 text-white/90">
              Start building your comprehensive academic portfolio and stand out from the crowd.
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-white text-college-maroon hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg shadow-college-darkmaroon/20"
            >
              <Link to="/signup" className="flex items-center gap-2">
                Create Free Account <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer component would be included via the layout */}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-on-scroll {
          opacity: 0;
        }
      `}} />
    </div>
  );
};

export default AboutPage;
