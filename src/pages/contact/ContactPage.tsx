
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Using the shared Navbar component instead of a custom header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-college-maroon">Contact Us</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-college-maroon mt-1" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-gray-600">
                        Vignana Jyothi Nagar, Pragathi Nagar,<br />
                        Nizampet (S.O), Hyderabad,<br />
                        Telangana, India - 500 090
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-college-maroon" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600">+91-040-23042758/59/60</p>
                      <p className="text-gray-600">Fax: +91-040-23042761</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-college-maroon" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">postbox@vnrvjiet.ac.in</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <a 
                    href="https://maps.google.com/?q=VNRVJIET+Hyderabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-college-maroon hover:bg-college-darkmaroon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-college-maroon"
                  >
                    Get Directions
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804.7894113675954!2d78.38359661485848!3d17.541207987987356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8e0ab28e0975%3A0x43da81f513d02dab!2sVNR%20Vignana%20Jyothi%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1650123456789!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="VNRVJIET Location"
                    className="w-full h-full"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#9B1C1F] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-6">VNRVJIET</div>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com/vnrvjiet" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/vnrvjiet" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/vnrvjiet" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/school/vnrvjiet" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://youtube.com/vnrvjiet" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
