
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight 
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const ContactPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  
  // College coordinates - example coordinates (replace with actual college coordinates)
  const collegeLocation = { lng: 78.4867, lat: 17.3850 }; // Example: Hyderabad coordinates
  
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [collegeLocation.lng, collegeLocation.lat],
      zoom: 14
    });
    
    // Add marker for college location
    new mapboxgl.Marker({ color: "#8B0000" })
      .setLngLat([collegeLocation.lng, collegeLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML("<h3>MeriTrack College</h3><p>Our main campus</p>"))
      .addTo(map.current);
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);
  
  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${collegeLocation.lat},${collegeLocation.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-college-maroon p-3 rounded-full text-white mr-4">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Location</h3>
                    <p className="text-gray-600">123 College Avenue, Hyderabad, Telangana, 500032</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-college-maroon p-3 rounded-full text-white mr-4">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <p className="text-gray-600">+91 40 1234 5678</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-college-maroon p-3 rounded-full text-white mr-4">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-gray-600">info@meritrack.edu</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-college-maroon p-3 rounded-full text-white mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  onClick={handleGetDirections}
                  className="bg-college-maroon hover:bg-college-darkmaroon flex items-center gap-2"
                >
                  <MapPin size={16} />
                  Get Directions
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
            
            {/* Map */}
            <div className="flex flex-col bg-white p-8 rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-6">Find Us</h2>
              
              {!mapboxToken ? (
                <div className="space-y-4 mb-6">
                  <p className="text-gray-600">Please enter your Mapbox token to view the map:</p>
                  <input 
                    type="text"
                    placeholder="Enter Mapbox public token"
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    You can get a free token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-college-maroon">mapbox.com</a>
                  </p>
                </div>
              ) : null}
              
              <div 
                ref={mapContainer} 
                className={`w-full rounded-lg ${mapboxToken ? 'h-[400px]' : 'h-0'}`} 
              />
              
              {!mapboxToken && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Map will be displayed here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Form (optional) */}
          <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            
            <form className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-college-maroon"
                  placeholder="Your name" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-college-maroon"
                  placeholder="Your email" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-college-maroon"
                  placeholder="Subject" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-college-maroon h-32"
                  placeholder="Write your message here..." 
                />
              </div>
              
              <div className="md:col-span-2">
                <Button className="bg-college-maroon hover:bg-college-darkmaroon">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
