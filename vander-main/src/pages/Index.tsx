
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import BackgroundImage from "../components/BackgroundImage";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden relative page-transition">
      <BackgroundImage fullHeight={true} />
      
      <div className="relative z-20 h-full flex flex-col justify-between items-center px-8 py-16">
        <div className="flex-1"></div>
        
        <div className={`transition-all duration-700 ease-out transform ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}>
          <div className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/30 mb-12">
            <Logo />
          </div>
          
          <h2 className="text-white text-center font-light text-xl mb-10 max-w-md mx-auto animate-fade-in leading-relaxed" 
            style={{animationDelay: "0.3s", textShadow: "0 2px 4px rgba(0,0,0,0.2)"}}>
            Discover the best places anywhere in the world. 
            <span className="block mt-1">Make your trip as dynamic as you.</span>
          </h2>
        </div>
        
        <div className={`w-full max-w-xs transition-all duration-700 ease-out delay-300 transform ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}>
          <button 
            onClick={() => navigate("/login")}
            className="vander-button w-full py-5 text-base font-medium shadow-lg rounded-2xl"
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
