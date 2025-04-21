
import React from "react";
import SignupForm from "@/components/auth/SignupForm";
import { Toaster } from "sonner";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SignupForm />
      <Toaster position="top-right" />
    </div>
  );
};

export default SignupPage;
