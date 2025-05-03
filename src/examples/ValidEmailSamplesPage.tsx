
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ValidEmailSamplesPage = () => {
  const studentEmails = [
    "12345A6789@vnrvjiet.in", 
    "98765A4321@vnrvjiet.in",
    "24075A0501@vnrvjiet.in",
    "20071A1201@vnrvjiet.in",
    "22071A0501@vnrvjiet.in"
  ];
  
  const facultyEmails = [
    "professor@vnrvjiet.in",
    "dean@vnrvjiet.in", 
    "hod@vnrvjiet.in",
    "faculty@vnrvjiet.in",
    "lecturer@vnrvjiet.in"
  ];
  
  const adminEmails = [
    "admin@vnrvjiet.in"
  ];
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="container mx-auto py-8 px-4"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center text-college-gray"
        variants={item}
      >
        Sample Email Formats
      </motion.h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-blue-700">Student Emails</CardTitle>
              <CardDescription>
                Format: 5 digits + 'A' + 4 digits + @vnrvjiet.in
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample Email</TableHead>
                    <TableHead className="w-[100px] text-right">Copy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentEmails.map((email) => (
                    <TableRow key={email}>
                      <TableCell className="font-mono">{email}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                The 6th character must be the letter 'A'
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="overflow-hidden border-t-4 border-t-purple-500 shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-purple-700">Faculty Emails</CardTitle>
              <CardDescription>
                Format: facultyname@vnrvjiet.in
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample Email</TableHead>
                    <TableHead className="w-[100px] text-right">Copy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facultyEmails.map((email) => (
                    <TableRow key={email}>
                      <TableCell className="font-mono">{email}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-3 bg-purple-50 rounded-md text-sm text-purple-700">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Contains only letters before @vnrvjiet.in
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="overflow-hidden border-t-4 border-t-green-500 shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-green-700">Admin Email</CardTitle>
              <CardDescription>
                Format: admin@vnrvjiet.in
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample Email</TableHead>
                    <TableHead className="w-[100px] text-right">Copy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminEmails.map((email) => (
                    <TableRow key={email}>
                      <TableCell className="font-mono">{email}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-3 bg-green-50 rounded-md text-sm text-green-700">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Only admin@vnrvjiet.in is accepted
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ValidEmailSamplesPage;
