
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

// Placeholder for the Mapbox token
// In a production app, this should be stored in environment variables
const MAPBOX_TOKEN = "YOUR_MAPBOX_TOKEN"; // Replace with your token

interface MapProps {
  location: string;
  name: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({ location, name, className = "h-64 w-full" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [token, setToken] = useState(MAPBOX_TOKEN);

  // Get coordinates based on location name
  const getCoordinates = async (locationName: string) => {
    try {
      // Using OpenStreetMap Nominatim API for geocoding (free and doesn't require token)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lng: parseFloat(data[0].lon),
          lat: parseFloat(data[0].lat)
        };
      }
      
      // Default coordinates if location not found
      return { lng: 0, lat: 0 };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return { lng: 0, lat: 0 };
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initializeMap = async () => {
      if (!mapContainer.current || !token || token === "YOUR_MAPBOX_TOKEN") return;
      
      try {
        mapboxgl.accessToken = token;
        
        const coordinates = await getCoordinates(location);
        
        if (!isMounted) return;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [coordinates.lng, coordinates.lat],
          zoom: 12
        });
        
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add marker for the place
        new mapboxgl.Marker({ color: "#4EC98D" })
          .setLngLat([coordinates.lng, coordinates.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>${name}</strong><br>${location}`))
          .addTo(map.current);
          
        setMapReady(true);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
    
    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
      }
    };
  }, [location, name, token]);
  
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setToken(tokenInput.trim());
      localStorage.setItem('mapbox_token', tokenInput.trim());
    }
  };

  useEffect(() => {
    // Try to load token from localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <div className={`glassmorphism rounded-xl overflow-hidden ${className}`}>
      {(!token || token === "YOUR_MAPBOX_TOKEN") ? (
        <div className="p-4 h-full flex flex-col items-center justify-center">
          <MapPin size={24} className="text-vander-green mb-2" />
          <h3 className="text-sm font-medium text-vander-dark mb-2">Map Visualization</h3>
          <p className="text-xs text-vander-gray mb-4 text-center">
            To view the map, please enter your Mapbox token
          </p>
          <form onSubmit={handleTokenSubmit} className="w-full max-w-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter your Mapbox token"
                className="form-input text-xs flex-1"
              />
              <button type="submit" className="vander-button px-3 py-2 text-xs">
                Set Token
              </button>
            </div>
            <p className="mt-2 text-xs text-vander-gray">
              Get your token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-vander-teal hover:underline">mapbox.com</a>
            </p>
          </form>
        </div>
      ) : !mapReady ? (
        <div className="h-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-vander-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div ref={mapContainer} className="h-full w-full" />
      )}
    </div>
  );
};

export default Map;
