import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo";
import BackgroundImage from "../components/BackgroundImage";
import BackButton from "../components/BackButton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
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
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Use the auth context to handle login
      login(data.token, {
        id: data._id,
        name: data.name,
        email: data.email
      });

      toast({
        title: "Success!",
        description: "Login successful. Welcome back!",
      });

      // Redirect to travel preference page
      navigate('/travel-preference');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Login failed',
      });
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
        
        <div className="absolute top-6 left-6">
          <BackButton to="/" />
        </div>
        
        <div className="mt-12 text-center animate-fade-up">
          <h1 className="text-3xl font-bold text-vander-dark mb-2">Welcome Back</h1>
          <p className="text-vander-gray">Sign in to continue your journey</p>
        </div>
        
        <div className="mt-6 max-w-md mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
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
            
            <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
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
            
            <div className="flex items-center justify-between animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="rounded border-gray-300 text-vander-green"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="text-vander-gray text-sm">Remember me</span>
              </label>
              
              <Link to="/forgot-password" className="text-vander-teal text-sm hover:text-vander-green">
                Forgot Password?
              </Link>
            </div>
            
            <div className="pt-2 animate-fade-up" style={{ animationDelay: "0.25s" }}>
              <button 
                type="submit" 
                className="vander-button w-full py-4"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-vander-gray text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-vander-teal font-medium hover:text-vander-green">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;