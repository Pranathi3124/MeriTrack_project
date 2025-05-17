
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SampleEmailsPage = () => {
  const emailFormats = [
    {
      role: "Student",
      format: "Exactly 10 characters: 5 digits + 'A' + 4 digits @vnrvjiet.in",
      examples: ["24075A0501@vnrvjiet.in", "20071A1201@vnrvjiet.in", "22071A0501@vnrvjiet.in"],
      color: "blue"
    },
    {
      role: "Faculty",
      format: "letters only @vnrvjiet.in",
      examples: ["professor@vnrvjiet.in", "faculty@vnrvjiet.in", "hod@vnrvjiet.in"],
      color: "purple"
    },
    {
      role: "Admin",
      format: "admin@vnrvjiet.in",
      examples: ["admin@vnrvjiet.in"],
      color: "green"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`Copied "${text}" to clipboard`))
      .catch(() => toast.error("Failed to copy"));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="gap-2" 
            asChild
          >
            <Link to="/login">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2">Valid Email Formats</h1>
          <p className="text-center text-gray-600 mb-8">Use these formats when registering or logging in</p>

          <div className="grid gap-6 md:grid-cols-3">
            {emailFormats.map((format) => (
              <Card 
                key={format.role} 
                className={`overflow-hidden border-t-4 border-t-${format.color}-500`}
              >
                <CardHeader className={`bg-gradient-to-r from-${format.color}-50 to-${format.color}-100`}>
                  <CardTitle className={`text-${format.color}-700`}>{format.role} Emails</CardTitle>
                  <CardDescription>{format.format}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {format.examples.map((email) => (
                      <div 
                        key={email} 
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <code className="font-mono text-sm">{email}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SampleEmailsPage;
