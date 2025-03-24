import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Place {
  name: string;
  location: string;
  type: 'activity' | 'transportation' | 'accommodation';
}

interface MapProps {
  places: Place[];
  center: string;
}

const Map: React.FC<MapProps> = ({ places, center }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize map
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.forEach(marker => marker.remove());
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Geocode center location
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(center)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data[0]) {
          const { lat, lon } = data[0];
          mapRef.current?.setView([lat, lon], 13);
        }
      })
      .catch(error => console.error('Error geocoding center:', error));

    // Geocode and add markers for each place
    places.forEach(place => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place.location)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data[0]) {
            const { lat, lon } = data[0];
            const marker = L.marker([lat, lon], { icon: getMarkerIcon(place.type) })
              .addTo(mapRef.current!)
              .bindPopup(`
                <div class="p-2">
                  <h3 class="font-semibold">${place.name}</h3>
                  <p class="text-sm text-gray-600">${place.location}</p>
                </div>
              `);
            markersRef.current.push(marker);
          }
        })
        .catch(error => console.error(`Error geocoding ${place.name}:`, error));
    });
  }, [places, center]);

  const handlePlaceClick = (place: Place) => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place.location)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data[0]) {
          const { lat, lon } = data[0];
          mapRef.current?.setView([lat, lon], 15);
          // Find and open the popup for this place
          const marker = markersRef.current.find(m => 
            m.getLatLng().lat === lat && m.getLatLng().lng === lon
          );
          marker?.openPopup();
        }
      })
      .catch(error => console.error(`Error geocoding ${place.name}:`, error));
  };

  const getMarkerIcon = (type: Place['type']) => {
    const iconUrl = type === 'activity' 
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
      : type === 'transportation'
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
    
    return L.icon({
      iconUrl,
      shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    });
  };

  return (
    <div className="space-y-4">
      <div ref={mapContainerRef} className="h-[400px] rounded-lg"></div>
      <div className="glassmorphism rounded-lg p-4">
        <h3 className="text-lg font-semibold text-vander-dark mb-3">Places in Itinerary</h3>
        <div className="space-y-2">
          {places.map((place, index) => (
            <button
              key={index}
              onClick={() => handlePlaceClick(place)}
              className="w-full text-left p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center space-x-2"
            >
              <div className={`w-3 h-3 rounded-full ${
                place.type === 'activity' ? 'bg-blue-500' :
                place.type === 'transportation' ? 'bg-green-500' :
                'bg-red-500'
              }`} />
              <div>
                <div className="font-medium text-vander-dark">{place.name}</div>
                <div className="text-sm text-vander-gray">{place.location}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
