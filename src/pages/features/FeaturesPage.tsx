
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, Award, BookOpen, Trophy, Briefcase, Code, GraduationCap, Activity } from 'lucide-react';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-college-maroon/90 via-college-darkmaroon to-college-maroon pt-20 pb-16 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">MeriTrack Features</h1>
            <p className="text-xl text-white/80">
              Discover the powerful tools designed to enhance your academic journey
            </p>
          </div>
        </div>
      </section>
      
      {/* Feature Cards */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Achievement Verification */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Achievement Verification</CardTitle>
                </div>
                <CardDescription>
                  Build credibility with faculty-verified accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  MeriTrack's verification system ensures that all achievements added to your portfolio are authenticated by faculty members or authorized personnel, giving your accomplishments the credibility they deserve.
                </p>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Key Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Greater trustworthiness for potential employers and graduate schools</li>
                    <li>Streamlined verification process with digital approvals</li>
                    <li>Verification badges that highlight authenticated achievements</li>
                    <li>Secure blockchain-based verification records</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive Tracking */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <Target size={24} className="text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Comprehensive Tracking</CardTitle>
                </div>
                <CardDescription>
                  Document all your achievements in one centralized platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  Our platform allows you to document and organize every aspect of your academic journey, from coursework and research to extracurricular activities and professional development.
                </p>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Achievement Categories:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-college-maroon mr-2" />
                      <span>Academic</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-blue-600 mr-2" />
                      <span>Sports</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                      <span>Internships</span>
                    </div>
                    <div className="flex items-center">
                      <Code className="h-5 w-5 text-purple-600 mr-2" />
                      <span>Hackathons</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-yellow-600 mr-2" />
                      <span>Workshops</span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-orange-600 mr-2" />
                      <span>Co-Curricular</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-purple-100 mr-3">
                    <Award size={24} className="text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Performance Insights</CardTitle>
                </div>
                <CardDescription>
                  Gain valuable analytics about your academic progress
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  MeriTrack's advanced analytics tools help you visualize your growth, identify strengths, and uncover areas for improvement throughout your academic journey.
                </p>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Insight Features:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Visual dashboards showing achievement distribution</li>
                    <li>Progress tracking across semesters</li>
                    <li>Skill acquisition mapping</li>
                    <li>Comparative analytics with anonymized peer benchmarks</li>
                    <li>Personalized recommendation engine for skill development</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Generation */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-yellow-100 mr-3">
                    <GraduationCap size={24} className="text-yellow-600" />
                  </div>
                  <CardTitle className="text-2xl">Portfolio Generation</CardTitle>
                </div>
                <CardDescription>
                  Create stunning portfolios to showcase your accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  Transform your tracked achievements into professionally designed portfolios that can be shared with potential employers, graduate schools, or scholarship committees.
                </p>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Portfolio Features:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Customizable portfolio templates</li>
                    <li>Achievement filtering and organization</li>
                    <li>Shareable public and private links</li>
                    <li>PDF export functionality</li>
                    <li>Integration with LinkedIn and other professional platforms</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
