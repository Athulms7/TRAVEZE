
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, className = "" }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-1 text-vander-dark hover:text-vander-green transition-colors ${className}`}
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </Link>
  );
};

export default BackButton;
