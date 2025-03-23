
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, Train, Calendar, Star, Info, Image, ArrowUpRight, Bookmark, BookmarkCheck } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import BackButton from "../components/BackButton";
import Map from "../components/Map";
import Weather from "../components/Weather";
import { addToSavedPlaces, getSavedPlaces, removeFromSavedPlaces, SavedPlace } from "../components/SavedPlaces";
import { useToast } from "@/hooks/use-toast";

const touristPlacesData = {
  "paris-eiffel": {
    name: "Eiffel Tower",
    location: "Paris, France",
    description: "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. Constructed from 1887 to 1889 as the entrance to the 1889 World's Fair, it was initially criticized by some of France's leading artists and intellectuals for its design, but it has become a global cultural icon of France.",
    distance: "2.5 km from Gare du Nord",
    bestTime: "April to June, September to October",
    rating: 4.7,
    openingHours: "9:00 AM - 11:45 PM",
    entryFee: "€16 - €26",
    images: [
      "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    ]
  },
  "delhi-taj-mahal": {
    name: "Taj Mahal",
    location: "Agra, Delhi NCR, India",
    description: "The Taj Mahal is an ivory-white marble mausoleum on the southern bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. The tomb is the centerpiece of a 17-hectare complex, which includes a mosque and a guest house, and is set in formal gardens bounded on three sides by a crenellated wall.",
    distance: "230 km from New Delhi Railway Station",
    bestTime: "October to March",
    rating: 4.9,
    openingHours: "Sunrise to Sunset (Closed on Fridays)",
    entryFee: "₹1100 for foreigners, ₹50 for Indians",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524492435071-3d128848a84a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    ]
  },
  "delhi-red-fort": {
    name: "Red Fort",
    location: "Delhi, India",
    description: "The Red Fort is a historic fort in the city of Delhi in India that served as the main residence of the Mughal Emperors. Emperor Shah Jahan commissioned construction of the Red Fort on 12 May 1638, when he decided to shift his capital from Agra to Delhi. Originally red and white, its design is credited to architect Ustad Ahmad Lahori, who also constructed the Taj Mahal.",
    distance: "4.5 km from New Delhi Railway Station",
    bestTime: "October to March",
    rating: 4.5,
    openingHours: "9:30 AM - 4:30 PM (Closed on Mondays)",
    entryFee: "₹600 for foreigners, ₹35 for Indians",
    images: [
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586152435071-3d128848a84a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    ]
  },
  "tokyo-sensoji": {
    name: "Sensō-ji Temple",
    location: "Tokyo, Japan",
    description: "Sensō-ji is an ancient Buddhist temple located in Asakusa, Tokyo, Japan. It is Tokyo's oldest temple, and one of its most significant. The temple is dedicated to the bodhisattva Kannon. According to legend, a statue of the Kannon was found in the Sumida River in 628 by two fishermen, the brothers Hinokuma Hamanari and Hinokuma Takenari.",
    distance: "3.7 km from Tokyo Station",
    bestTime: "March to May, September to November",
    rating: 4.6,
    openingHours: "24 hours (Main hall: 6:00 AM - 5:00 PM)",
    entryFee: "Free",
    images: [
      "https://images.unsplash.com/photo-1583400757633-318cefc9a0a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590559899731-a382839e5549?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598627446792-5d89ab3e3540?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    ]
  }
};

const placeIdToNumericId: Record<string, number> = {
  "paris-eiffel": 1,
  "tokyo-sensoji": 2,
  "delhi-taj-mahal": 3,
  "delhi-red-fort": 4
};

const PlaceDetails = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const [placeData, setPlaceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTimeout(() => {
      if (placeId && touristPlacesData[placeId as keyof typeof touristPlacesData]) {
        setPlaceData(touristPlacesData[placeId as keyof typeof touristPlacesData]);
        
        // Check if place is already saved
        if (placeId) {
          const numericId = placeIdToNumericId[placeId] || 0;
          const savedPlaces = getSavedPlaces();
          setIsSaved(savedPlaces.some(place => place.id === numericId));
        }
      } else {
        console.error("Place not found");
      }
      setLoading(false);
    }, 500);
  }, [placeId]);

  const toggleSavePlace = () => {
    if (placeData && placeId) {
      const numericId = placeIdToNumericId[placeId] || Math.floor(Math.random() * 1000);
      
      if (isSaved) {
        // Remove from saved places
        removeFromSavedPlaces(numericId);
        setIsSaved(false);
        toast({
          title: "Place removed",
          description: `${placeData.name} has been removed from your saved places.`,
          variant: "default",
        });
      } else {
        // Add to saved places
        const placeToSave: SavedPlace = {
          id: numericId,
          name: placeData.name,
          description: placeData.description.substring(0, 100) + '...',
          imageUrl: placeData.images[0],
          isFavorite: false
        };
        
        const wasAdded = addToSavedPlaces(placeToSave);
        
        if (wasAdded) {
          setIsSaved(true);
          toast({
            title: "Place saved",
            description: `${placeData.name} has been added to your saved places.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Already saved",
            description: `${placeData.name} is already in your saved places.`,
            variant: "default",
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-vander-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-vander-gray">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (!placeData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-6xl mb-4">🏝️</div>
          <h2 className="text-2xl font-bold text-vander-dark mb-2">Place Not Found</h2>
          <p className="text-vander-gray mb-6">The place you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/self-planning")}
            className="vander-button px-5 py-3"
          >
            Go Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative page-transition">
      <BackgroundImage fullHeight={false} />

      <div className="relative z-20 min-h-screen flex flex-col pb-12">
        <div className="h-64 sm:h-80 md:h-96 relative">
          <img 
            src={placeData.images[activeImageIndex]}
            alt={placeData.name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {placeData.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === index ? 'bg-white w-4' : 'bg-white/60'}`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="absolute top-6 left-0 right-0 flex justify-between px-6">
            <BackButton to="/self-planning" className="bg-white/80 hover:bg-white backdrop-blur-sm px-3 py-1 rounded-lg" />
            
            <button
              onClick={toggleSavePlace}
              className={`flex items-center gap-1 backdrop-blur-sm px-3 py-1 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-vander-green text-white' 
                  : 'bg-white/80 hover:bg-white text-vander-green'
              }`}
              aria-label={isSaved ? "Remove from saved places" : "Save this place"}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck size={18} />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>

          <div className="absolute right-4 bottom-4 flex gap-2">
            {placeData.images.map((img, index) => (
              <button 
                key={index} 
                className={`w-12 h-12 rounded-md border-2 overflow-hidden ${activeImageIndex === index ? 'border-white' : 'border-white/50 opacity-70'}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 glassmorphism mx-4 -mt-8 rounded-t-3xl p-6">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl font-bold text-vander-dark">{placeData.name}</h1>
            <div className="flex items-center bg-vander-green/10 px-2 py-1 rounded-lg">
              <Star size={16} className="text-vander-green mr-1" fill="currentColor" />
              <span className="font-medium text-vander-dark">{placeData.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-vander-gray mb-6">
            <MapPin size={16} className="mr-1" />
            <span>{placeData.location}</span>
          </div>
          
          <div className="mb-6">
            <Weather location={placeData?.location || ""} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <Train size={18} className="text-vander-teal mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-vander-dark">Distance from Station</h3>
                  <p className="text-vander-gray">{placeData.distance}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock size={18} className="text-vander-teal mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-vander-dark">Opening Hours</h3>
                  <p className="text-vander-gray">{placeData.openingHours}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar size={18} className="text-vander-teal mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-vander-dark">Best Time to Visit</h3>
                  <p className="text-vander-gray">{placeData.bestTime}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Info size={18} className="text-vander-teal mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-vander-dark">Entry Fee</h3>
                  <p className="text-vander-gray">{placeData.entryFee}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Image size={18} className="text-vander-teal mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-vander-dark">Photo Spot</h3>
                  <p className="text-vander-gray">Multiple viewpoints available</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-vander-dark mb-3">About</h2>
            <p className="text-vander-gray leading-relaxed">
              {placeData.description}
            </p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-vander-dark mb-3">Location</h2>
            <Map 
              location={placeData.location} 
              name={placeData.name} 
              className="h-64 sm:h-72 md:h-80 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
