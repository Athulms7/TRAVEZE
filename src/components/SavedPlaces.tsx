
import React, { useEffect } from "react";
import { Bookmark, Heart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Define a type for the places
export type SavedPlace = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isFavorite: boolean;
};

// In a real app, this would be fetched from an API or local storage
const initialSavedPlaces = [
  {
    id: 1,
    name: "Paris, France",
    description: "City of Love with stunning architecture and cuisine",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-4654415f7ce4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    isFavorite: true
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    description: "Historic city with beautiful temples and gardens",
    imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    isFavorite: false
  }
];

// Create a global variable to store saved places across components
// In a real app, this would be managed by a state management library like Redux or Context API
let globalSavedPlaces: SavedPlace[] = [...initialSavedPlaces];

// Function to get saved places
export const getSavedPlaces = () => {
  return globalSavedPlaces;
};

// Function to add a new place to saved places
export const addToSavedPlaces = (place: SavedPlace) => {
  // Check if the place already exists
  const existingPlace = globalSavedPlaces.find(p => p.id === place.id);
  
  if (!existingPlace) {
    globalSavedPlaces = [...globalSavedPlaces, place];
    return true; // Place was added
  }
  
  return false; // Place already exists
};

// Function to remove a place from saved places
export const removeFromSavedPlaces = (id: number) => {
  globalSavedPlaces = globalSavedPlaces.filter(place => place.id !== id);
};

const SavedPlaces: React.FC = () => {
  const [places, setPlaces] = React.useState<SavedPlace[]>(globalSavedPlaces);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update the local state when global state changes
  useEffect(() => {
    setPlaces([...globalSavedPlaces]);
  }, []);

  const toggleFavorite = (id: number) => {
    const updatedPlaces = places.map(place => 
      place.id === id ? {...place, isFavorite: !place.isFavorite} : place
    );
    setPlaces(updatedPlaces);
    
    // Update the global state
    globalSavedPlaces = updatedPlaces;
  };

  const removePlace = (id: number) => {
    removeFromSavedPlaces(id);
    setPlaces([...globalSavedPlaces]);
    
    toast({
      title: "Place removed",
      description: "The place has been removed from your saved places.",
      variant: "default",
    });
  };

  const handleViewDetails = (placeId: number) => {
    // This is a simplified mapping. In a real app, you'd have a proper mapping or API call
    const placeMap: Record<number, string> = {
      1: "paris-eiffel",
      2: "tokyo-sensoji",
      3: "delhi-taj-mahal",
      4: "delhi-red-fort"
    };
    
    const routePlaceId = placeMap[placeId] || "paris-eiffel";
    navigate(`/place/${routePlaceId}`);
  };

  return (
    <div className="glassmorphism rounded-2xl p-4 h-full">
      <h2 className="text-xl font-semibold text-vander-dark mb-4">
        Saved Places
      </h2>
      
      {places.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Bookmark size={48} className="text-gray-300 mb-4" />
          <p className="text-vander-gray">You haven't saved any places yet.</p>
          <p className="text-sm text-vander-gray mt-2">
            Save places during your searches to find them here later.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {places.map((place) => (
            <div 
              key={place.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex"
            >
              <div 
                className="w-24 h-24 flex-shrink-0 bg-gray-200 overflow-hidden cursor-pointer"
                onClick={() => handleViewDetails(place.id)}
              >
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 
                    className="font-medium text-vander-dark cursor-pointer hover:text-vander-green transition-colors"
                    onClick={() => handleViewDetails(place.id)}
                  >
                    {place.name}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleFavorite(place.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={place.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart size={18} fill={place.isFavorite ? "currentColor" : "none"} 
                        className={place.isFavorite ? "text-red-500" : ""} />
                    </button>
                    <button
                      onClick={() => removePlace(place.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove place"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-vander-gray mt-1">{place.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPlaces;
