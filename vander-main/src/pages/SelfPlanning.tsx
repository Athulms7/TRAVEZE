
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Search, Bookmark } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import ChatInterface from "../components/ChatInterface";
import SearchBar from "../components/SearchBar";
import SavedPlaces from "../components/SavedPlaces";
import Logo from "../components/Logo";
import BackButton from "../components/BackButton";

const SelfPlanning = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "search" | "saved" | null>(null);
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
        
        {/* Top navigation buttons */}
        <div className="glassmorphism mx-4 mt-6 rounded-full flex justify-between p-2 shadow-md">
          <button 
            onClick={() => setActiveTab(activeTab === "chat" ? null : "chat")}
            className={`flex items-center justify-center rounded-full p-3 transition-all ${
              activeTab === "chat" 
                ? "bg-gradient-to-r from-vander-green to-vander-teal text-white" 
                : "text-vander-dark hover:bg-white/50"
            }`}
          >
            <MessageCircle size={20} />
            <span className="ml-2 font-medium">Chat</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(activeTab === "search" ? null : "search")}
            className={`flex items-center justify-center rounded-full p-3 transition-all ${
              activeTab === "search" 
                ? "bg-gradient-to-r from-vander-green to-vander-teal text-white" 
                : "text-vander-dark hover:bg-white/50"
            }`}
          >
            <Search size={20} />
            <span className="ml-2 font-medium">Search</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(activeTab === "saved" ? null : "saved")}
            className={`flex items-center justify-center rounded-full p-3 transition-all ${
              activeTab === "saved" 
                ? "bg-gradient-to-r from-vander-green to-vander-teal text-white" 
                : "text-vander-dark hover:bg-white/50"
            }`}
          >
            <Bookmark size={20} />
            <span className="ml-2 font-medium">Saved</span>
          </button>
        </div>
        
        {/* Content area */}
        <div className="flex-1 p-4 overflow-auto">
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "search" && <SearchBar />}
          {activeTab === "saved" && <SavedPlaces />}
          
          {!activeTab && (
            <div className="h-full flex flex-col justify-center items-center text-center">
              <div className="glassmorphism p-8 rounded-2xl max-w-md">
                <h2 className="text-2xl font-semibold text-vander-dark mb-4">
                  Start Planning Your Trip
                </h2>
                <p className="text-vander-gray mb-6">
                  Use the buttons above to chat with our AI assistant, search for destinations, 
                  or view your saved places.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setActiveTab("chat")}
                    className="vander-button px-5 py-3 flex items-center"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    Chat with AI
                  </button>
                  <button 
                    onClick={() => setActiveTab("search")}
                    className="vander-button px-5 py-3 flex items-center"
                  >
                    <Search size={18} className="mr-2" />
                    Search Places
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfPlanning;
