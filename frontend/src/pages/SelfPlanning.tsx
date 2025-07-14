import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import Logo from "../components/Logo";
import BackButton from "../components/BackButton";




const SelfPlanning = () => {
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

const user = localStorage.getItem("user");



  const [formData, setFormData] = useState({
    mood: '',
    current_location: '',
    days: '',
    budget: '',
    destination: '',
    user:user
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [itinerary]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
   
    e.preventDefault();
    setIsLoading(true);
    setItinerary("");

    try {
      const response = await fetch(`http://localhost:5000/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response) {
        throw new Error("Failed to generate itinerary");
      }

      const text = await response.text();

      setItinerary(text);
      navigate("/itineraries");
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setItinerary("Error: Unable to generate itinerary.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => navigate("/travel-preference");

  return (
    <div className="h-screen w-full overflow-hidden relative page-transition">
      <BackgroundImage fullHeight={false} />

      <div className="relative z-20 h-full flex flex-col">
        <div className="absolute top-6 left-6 z-30">
          <BackButton to="/travel-preference" />
        </div>

        <div className="pt-6 flex justify-center">
          <div
            onClick={handleLogoClick}
            className="glassmorphism p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <Logo />
          </div>
        </div>

        <div className="glassmorphism mx-4 mt-6 rounded-full flex justify-center p-2 shadow-md">
          <div className="flex items-center gap-2 text-vander-dark">
            <MessageCircle size={20} />
            <span className="font-medium">Plan Your Trip with AI Assistant</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="mx-4 mt-6 space-y-4">
          <form onSubmit={handleSubmit} className="glassmorphism p-4 rounded-xl space-y-4">
            <select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-vander-dark focus:ring-2 focus:ring-vander-green"
            >
              <option value="">Select Mood</option>
              <option value="adventurous">Adventurous</option>
              <option value="relaxed">Relaxed</option>
              <option value="cultural">Cultural</option>
              <option value="romantic">Romantic</option>
              <option value="family-friendly">Family-friendly</option>
              <option value="luxury">Luxury</option>
              <option value="budget-friendly">Budget-friendly</option>
              <option value="spiritual">Spiritual</option>
              <option value="thrifting">Thrifting clothes</option>
            </select>

            <input
              type="text"
              name="current_location"
              placeholder="Current Location"
              value={formData.current_location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-vander-dark placeholder-vander-gray/50 focus:ring-2 focus:ring-vander-green"
            />

            <input
              type="number"
              name="days"
              placeholder="Number of Days"
              value={formData.days}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-vander-dark placeholder-vander-gray/50 focus:ring-2 focus:ring-vander-green"
            />

            <input
              type="number"
              name="budget"
              placeholder="Budget in INR"
              value={formData.budget}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-vander-dark placeholder-vander-gray/50 focus:ring-2 focus:ring-vander-green"
            />

            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-vander-dark placeholder-vander-gray/50 focus:ring-2 focus:ring-vander-green"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-vander-green text-white rounded-lg px-4 py-2 hover:bg-vander-teal transition-colors disabled:opacity-50"
              onClick={handleSubmit}
            >
              {isLoading ? 'Planning...' : 'Generate Itinerary'}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="flex-1 mx-4 mt-4 overflow-y-auto space-y-4 whitespace-pre-wrap text-left text-sm text-vander-dark">
          {itinerary && (
            <div className="bg-white/20 rounded-lg p-4">
              {itinerary}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default SelfPlanning;
