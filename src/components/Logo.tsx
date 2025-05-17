
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/lovable-uploads/09ca2645-762c-4dc5-855e-517732e69837.png"
        alt="MeriTrack Logo"
        className={className || "h-10 w-auto"}
      />
    </div>
  );
};

export default Logo;
