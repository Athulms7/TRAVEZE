import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Palmtree, Luggage } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import BackButton from "../components/BackButton";
import { useToast } from "@/components/ui/use-toast";

const TravelPreference = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to access this page.",
      });
      navigate('/login');
      return;
    }
  }, [navigate, toast]);

  return (
    <div className="h-screen w-full overflow-hidden relative page-transition">
      <BackgroundImage fullHeight={true} />
      
      {/* Back button - Update to go to home instead of login since user is authenticated */}
      <div className="absolute top-6 left-6 z-30">
        <BackButton to="/" />
      </div>
      
      <div className="relative z-20 h-full flex flex-col justify-center items-center px-8 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-white text-3xl font-bold mb-10 text-center animate-fade-in text-gradient-primary bg-gradient-to-r from-vander-blue to-vander-teal" 
            style={{textShadow: "0 2px 4px rgba(0,0,0,0.3)"}}>
            How would you like to Travel?
          </h1>
          
          <div className="flex flex-col gap-5 animate-fade-up" style={{animationDelay: "0.2s"}}>
            <button 
              onClick={() => navigate("/holiday-packages")}
              className="glassmorphism flex items-center justify-between p-6 rounded-2xl hover:bg-white/90 transition-all duration-300 group"
            >
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-vander-dark mb-2 group-hover:text-vander-blue transition-colors">Holiday Packages</h2>
                <p className="text-sm text-vander-gray">Curated travel experiences for you</p>
              </div>
              <div className="bg-gradient-to-r from-vander-blue to-vander-teal p-4 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <Palmtree className="text-white" size={24} />
              </div>
            </button>
            
            <button 
              onClick={() => navigate("/self-planning")}
              className="glassmorphism flex items-center justify-between p-6 rounded-2xl hover:bg-white/90 transition-all duration-300 group"
            >
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-vander-dark mb-2 group-hover:text-vander-green transition-colors">Self Planning</h2>
                <p className="text-sm text-vander-gray">Create your own adventure</p>
              </div>
              <div className="bg-gradient-to-r from-vander-green to-vander-teal p-4 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <Compass className="text-white" size={24} />
              </div>
            </button>
            
            <button 
              onClick={() => navigate("/itineraries")}
              className="glassmorphism flex items-center justify-between p-6 rounded-2xl hover:bg-white/90 transition-all duration-300 group"
            >
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-vander-dark mb-2 group-hover:text-vander-teal transition-colors">Ready to Go</h2>
                <p className="text-sm text-vander-gray">View your saved travel itineraries</p>
              </div>
              <div className="bg-gradient-to-r from-vander-teal to-vander-blue p-4 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <Luggage className="text-white" size={24} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPreference;
