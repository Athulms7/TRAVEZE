
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import Logo from "../components/Logo";
import BackgroundImage from "../components/BackgroundImage";
import { toast } from "../hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions.",
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden relative page-transition">
        <BackgroundImage />
        
        <div className="relative z-20 min-h-screen flex flex-col pt-20 pb-8 px-6">
          <div className="flex justify-center mb-4 animate-fade-in">
            <Logo />
          </div>
          
          <div className="mt-16 flex-1 flex flex-col items-center justify-center">
            <div className="text-center animate-fade-up max-w-md">
              <h1 className="text-3xl font-bold text-vander-dark mb-4">Check your email</h1>
              <p className="text-vander-gray mb-8">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="vander-button inline-block py-3 px-6">
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative page-transition">
      <BackgroundImage />
      
      <div className="relative z-20 min-h-screen flex flex-col pt-20 pb-8 px-6">
        <div className="flex justify-center mb-4 animate-fade-in">
          <Logo />
        </div>
        
        <div className="absolute top-6 left-6">
          <Link to="/login" className="flex items-center gap-1 text-vander-dark">
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>
        
        <div className="mt-16 text-center animate-fade-up">
          <h1 className="text-3xl font-bold text-vander-dark mb-2">Forgot password?</h1>
          <p className="text-vander-gray">Enter your email address to reset your password</p>
        </div>
        
        <div className="mt-8 max-w-md mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <input
                type="email"
                placeholder="Email address"
                className="form-input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-2 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <button 
                type="submit" 
                className="vander-button w-full py-4 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-pulse">Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-vander-gray text-sm">
              Remember your password?{" "}
              <Link to="/login" className="text-vander-teal font-medium hover:text-vander-green">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
