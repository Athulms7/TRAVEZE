import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, X, Bookmark, BookmarkCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToSavedPlaces, getSavedPlaces, SavedPlace, removeFromSavedPlaces } from "./SavedPlaces";

const touristPlaces = [
  {
    id: 1,
    name: "Eiffel Tower",
    location: "Paris, France",
    description: "Iconic 330m-tall wrought-iron tower with restaurants and an observation deck",
    image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
    routeId: "paris-eiffel"
  },
  {
    id: 2,
    name: "Sensō-ji Temple",
    location: "Tokyo, Japan",
    description: "Ancient Buddhist temple with a five-story pagoda and traditional shops",
    image: "https://images.unsplash.com/photo-1583400757633-318cefc9a0a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
    routeId: "tokyo-sensoji"
  },
  {
    id: 3,
    name: "Taj Mahal",
    location: "Agra, India",
    description: "Iconic white marble mausoleum built by Emperor Shah Jahan",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
    routeId: "delhi-taj-mahal"
  },
  {
    id: 4,
    name: "Red Fort",
    location: "Delhi, India",
    description: "Historic fort complex housing museums and cultural artifacts",
    image: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
    routeId: "delhi-red-fort"
  }
];

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState(touristPlaces);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    
    if (searchQuery.trim() === "") {
      setFilteredPlaces(touristPlaces);
    } else {
      const filtered = touristPlaces.filter(
        place => 
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
    
    setShowResults(true);
  };

  const clearSearch = () => {
    setQuery("");
    setShowResults(false);
  };

  const viewPlaceDetails = (routeId: string) => {
    navigate(`/place/${routeId}`);
  };

  const isPlaceSaved = (placeId: number) => {
    const savedPlaces = getSavedPlaces();
    return savedPlaces.some(place => place.id === placeId);
  };

  const toggleSavePlace = (place: any) => {
    const isSaved = isPlaceSaved(place.id);
    
    if (isSaved) {
      removeFromSavedPlaces(place.id);
      toast({
        title: "Place removed",
        description: `${place.name} has been removed from your saved places.`,
        variant: "default",
      });
    } else {
      const newPlace: SavedPlace = {
        id: place.id,
        name: place.name,
        description: place.description,
        imageUrl: place.image,
        isFavorite: false
      };
      
      const wasAdded = addToSavedPlaces(newPlace);
      
      if (wasAdded) {
        toast({
          title: "Place saved",
          description: `${place.name} has been added to your saved places.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Already saved",
          description: `${place.name} is already in your saved places.`,
          variant: "default",
        });
      }
    }

    setFilteredPlaces([...filteredPlaces]);
  };

  return (
    <div className="h-full glassmorphism rounded-2xl p-4">
      <div className="relative mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-vander-gray" />
          </div>
          <input
            type="search"
            value={query}
            onChange={handleSearch}
            className="block w-full p-4 pl-10 pr-10 bg-white border-none rounded-full focus:ring-2 focus:ring-vander-green focus:outline-none"
            placeholder="Search for places..."
          />
          {query && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={clearSearch}
            >
              <X className="h-5 w-5 text-vander-gray hover:text-vander-dark" />
            </button>
          )}
        </div>
      </div>

      {showResults && (
        <div className="space-y-4">
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-vander-gray">No places found matching "{query}"</p>
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <div 
                key={place.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-40 w-full">
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-3">
                    <h3 className="text-white font-semibold text-lg">{place.name}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin size={14} className="mr-1" />
                      <span>{place.location}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => toggleSavePlace(place)}
                      className={`p-2 rounded-full ${
                        isPlaceSaved(place.id) 
                          ? 'bg-vander-green text-white' 
                          : 'bg-white/80 text-vander-dark hover:bg-white'
                      } transition-colors`}
                      aria-label={isPlaceSaved(place.id) ? "Saved" : "Save this place"}
                    >
                      {isPlaceSaved(place.id) ? (
                        <BookmarkCheck size={18} />
                      ) : (
                        <Bookmark size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-vander-gray text-sm mb-3">
                    {place.description}
                  </p>
                  <button
                    onClick={() => viewPlaceDetails(place.routeId)}
                    className="w-full py-2 px-4 bg-vander-teal/10 text-vander-teal font-medium rounded-lg hover:bg-vander-teal/20 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!showResults && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-vander-dark mb-2">Discover New Places</h3>
          <p className="text-vander-gray text-center">
            Search for destinations and tourist attractions around the world
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
