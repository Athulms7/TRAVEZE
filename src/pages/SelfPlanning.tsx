import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import ChatInterface from "../components/ChatInterface";
import Logo from "../components/Logo";
import BackButton from "../components/BackButton";

const SelfPlanning = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/travel-preference");
  };

  return (
    <div className="h-screen w-full overflow-hidden relative page-transition">
      <BackgroundImage fullHeight={false} />
      
      <div className="relative z-20 h-full flex flex-col">
        {/* Back button */}
        <div className="absolute top-6 left-6 z-30">
          <BackButton to="/travel-preference" />
        </div>
        
        {/* Logo at top center */}
        <div className="pt-6 flex justify-center">
          <div 
            onClick={handleLogoClick}
            className="glassmorphism p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <Logo />
          </div>
        </div>
        
        {/* Chat button at top */}
        <div className="glassmorphism mx-4 mt-6 rounded-full flex justify-center p-2 shadow-md">
          <div className="flex items-center gap-2 text-vander-dark">
            <MessageCircle size={20} />
            <span className="font-medium">Chat with AI Travel Assistant</span>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 mx-4 mt-4 mb-4">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default SelfPlanning;
