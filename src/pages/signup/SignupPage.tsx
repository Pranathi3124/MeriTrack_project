
import React from "react";
import SignupForm from "@/components/auth/SignupForm";
import { Toaster } from "sonner";
import { motion } from "framer-motion";

const SignupPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <SignupForm />
      <Toaster position="top-right" />
    </motion.div>
  );
};

export default SignupPage;
