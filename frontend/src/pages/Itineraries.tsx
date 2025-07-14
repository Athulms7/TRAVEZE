import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import { useEffect, useState } from "react";

// Sample itinerary data
const sampleItineraries = [
  {
    id: "paris-2023",
    title: "Paris Adventure",
    location: "Paris, France",
    duration: "5 days",
    image:
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    startDate: "June 15, 2023",
  },

];



const Itineraries = () => {
  const [itineraries, setItinerary] = useState([]);
  const navigate = useNavigate();
  async function getHandler(): Promise<void> {
    const token: any =localStorage.getItem("token")

    const resp=await fetch("http://localhost:3000/api/auth/it",{
      method:"POST",
      headers:{
        authorization:token
      }
    })
    const data = await resp.json();
    setItinerary(data.itenaries);
    console.log(itineraries)
  }
  useEffect(() => {
    getHandler();
  }, []);
  console.log(itineraries);

  return (
    <div className="min-h-screen bg-vander-light">
      <BackgroundImage />
      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="mb-6">
          <button
            onClick={() => navigate("/travel-preference")}
            className="flex items-center text-vander-dark hover:text-vander-teal transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Travel Preferences</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gradient-primary bg-gradient-to-r from-vander-blue to-vander-teal">
          Your Travel Itineraries
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary:{_id:string,image:string,destination:string,title:string,numberOfDays:string,}) => (
            <div
              key={itinerary._id}
              onClick={() => navigate(`/itinerary/${itinerary._id}`)}
              className="glassmorphism rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={itinerary.image}
                  alt={itinerary.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-semibold mb-1">
                    {itinerary.title}
                  </h3>
                  <div className="flex items-center text-white/80">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{itinerary.destination}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-vander-dark">
                    <Calendar size={16} className="mr-1" />
                    <span className="text-sm">{sampleItineraries[0].startDate}</span>
                  </div>
                  <div className="flex items-center text-vander-teal">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">{itinerary.numberOfDays} Days</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sampleItineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              onClick={() => navigate(`/itinerary/${itinerary.id}`)}
              className="glassmorphism rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={itinerary.image}
                  alt={itinerary.location}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-semibold mb-1">
                    {itinerary.title}
                  </h3>
                  <div className="flex items-center text-white/80">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{itinerary.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-vander-dark">
                    <Calendar size={16} className="mr-1" />
                    <span className="text-sm">{sampleItineraries[0].startDate}</span>
                  </div>
                  <div className="flex items-center text-vander-teal">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">{itinerary.duration} Days</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Itineraries;
