
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { motion } from "framer-motion";
import { Toaster } from "sonner";

const LoginPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <LoginForm />
      <Toaster position="top-right" />
    </motion.div>
  );
};

export default LoginPage;
