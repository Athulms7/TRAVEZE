import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo";
import BackgroundImage from "../components/BackgroundImage";
import BackButton from "../components/BackButton";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    termsAccepted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: "Success!",
        description: "Registration successful. Please login to continue.",
      });

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Registration failed',
      });
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative page-transition">
      <BackgroundImage />
      
      <div className="relative z-20 min-h-screen flex flex-col pt-20 pb-8 px-6">
        <div className="flex justify-center mb-4 animate-fade-in">
          <Logo />
        </div>
        
        {/* Back button */}
        <div className="absolute top-6 left-6">
          <BackButton to="/login" />
        </div>
        
        <div className="mt-12 text-center animate-fade-up">
          <h1 className="text-3xl font-bold text-vander-dark mb-2">Register</h1>
          <p className="text-vander-gray">Create an account to start your journey</p>
        </div>
        
        <div className="mt-6 max-w-md mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="form-input w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="form-input w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="form-input w-full"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="relative animate-fade-up" style={{ animationDelay: "0.25s" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-input w-full pr-12"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="mt-2 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  className="rounded border-gray-300 text-vander-green mt-1"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />
                <span className="text-vander-gray text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-vander-teal hover:text-vander-green">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-vander-teal hover:text-vander-green">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
            
            <div className="pt-2 animate-fade-up" style={{ animationDelay: "0.35s" }}>
              <button 
                type="submit" 
                className="vander-button w-full py-4"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <p className="text-vander-gray text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-vander-teal font-medium hover:text-vander-green">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
