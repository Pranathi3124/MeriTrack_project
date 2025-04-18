import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BarChart, 
  Shield, 
  Clock, 
  Award,
  Target,
  Sparkles,
  Star,
  CheckCircle,
  BookOpen,
  GraduationCap,
  UserPlus,
  MapPin
} from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const HeroSection = () => (
  <section className="bg-gradient-to-r from-college-lightmaroon to-college-maroon text-white py-24">
    <div className="container mx-auto px-4">
      <div className="lg:flex items-center">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-4xl font-bold mb-6">Empowering Education with MeriTrack</h1>
          <p className="text-xl mb-8">
            Your all-in-one solution for efficient student tracking, performance analysis, and secure academic records.
          </p>
          <div className="flex space-x-4">
            <Link to="/signup">
              <Button className="bg-white text-college-maroon hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img 
            src="/hero-image.svg"
            alt="MeriTrack Dashboard"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart className="h-10 w-10 text-college-maroon" />,
      title: "Performance Tracking",
      description: "Track student academic progress with comprehensive analytics and performance metrics.",
      link: "/features/performance"
    },
    {
      icon: <Shield className="h-10 w-10 text-college-maroon" />,
      title: "Secure Records",
      description: "Maintain secure, tamper-proof academic records with our advanced security measures.",
      link: "/features/security"
    },
    {
      icon: <Clock className="h-10 w-10 text-college-maroon" />,
      title: "Real-time Updates",
      description: "Get instant notifications about academic achievements, events, and milestones.",
      link: "/features/updates"
    },
    {
      icon: <Award className="h-10 w-10 text-college-maroon" />,
      title: "Achievement Recognition",
      description: "Celebrate and showcase student accomplishments with digital certificates and badges.",
      link: "/features/achievements"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Tracking System</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MeriTrack offers powerful tools to empower educational institutions and students.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link 
                    to={feature.link} 
                    className="text-college-maroon hover:text-college-darkmaroon font-medium inline-flex items-center"
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{feature.title}</h4>
                    <p className="text-sm">
                      Click to learn more about our {feature.title.toLowerCase()} features and how they can benefit your institution.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUsSection = () => {
  const reasons = [
    {
      icon: <Target className="h-8 w-8 text-college-maroon" />,
      title: "Data-Driven Insights",
      description: "Leverage real-time data analytics to make informed decisions and improve student outcomes."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-college-maroon" />,
      title: "Customizable Solutions",
      description: "Tailor MeriTrack to fit the unique needs of your institution with our flexible and customizable platform."
    },
    {
      icon: <Star className="h-8 w-8 text-college-maroon" />,
      title: "Enhanced Security",
      description: "Protect sensitive student data with our robust security features and compliance standards."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-college-maroon" />,
      title: "Seamless Integration",
      description: "Integrate MeriTrack with your existing systems for a smooth and hassle-free transition."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose MeriTrack?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the benefits of using MeriTrack to streamline your academic processes and enhance student success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              <div className="mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "MeriTrack has transformed the way we manage student data. It's intuitive, efficient, and has greatly improved our reporting capabilities.",
      author: "Dr. Smith, Dean of Academics"
    },
    {
      quote: "As a student, I find MeriTrack incredibly helpful for tracking my progress and staying on top of my academic goals.",
      author: "Jane Doe, Student"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read testimonials from educators and students who have experienced the benefits of MeriTrack.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <blockquote className="text-gray-700 italic mb-4">
                "{testimonial.quote}"
              </blockquote>
              <p className="text-gray-600 font-medium">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToActionSection = () => (
  <section className="py-24 bg-college-maroon text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
      <p className="text-xl mb-8">
        Join MeriTrack today and revolutionize the way you manage student data and track academic performance.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/signup">
          <Button className="bg-white text-college-maroon hover:bg-gray-100">
            Sign Up Now
          </Button>
        </Link>
        <Link to="/contact">
          <Button variant="outline">Contact Us</Button>
        </Link>
      </div>
    </div>
  </section>
);

const FooterSection = () => (
  <footer className="py-6 bg-gray-800 text-white">
    <div className="container mx-auto text-center">
      <p>© {new Date().getFullYear()} MeriTrack. All rights reserved.</p>
    </div>
  </footer>
);

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
