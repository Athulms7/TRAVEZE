import React from "react";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import HolidayPackageCard from "../components/HolidayPackageCard";
import type { HolidayPackage } from "../components/HolidayPackageCard";

const HolidayPackages = () => {
  const navigate = useNavigate();

  const packages: HolidayPackage[] = [
    {
      id: "bali-paradise",
      name: "Bali Paradise",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      duration: { nights: 5, days: 6 },
      priceRange: { min: 1200, max: 1800, currency: "$" },
      highlights: [
        { type: "hotel", text: "5-star luxury resorts with ocean view" },
        { type: "flight", text: "Return flights included with 20kg luggage" },
        { type: "cruise", text: "Island hopping day cruise experience" }
      ],
      bookingOptions: [
        { name: "MakeMyTrip", logo: "/makemytrip.png", url: "https://www.makemytrip.com" },
        { name: "Expedia", logo: "/expedia.png", url: "https://www.expedia.com" }
      ]
    },
    {
      id: "swiss-alps",
      name: "Swiss Alps Adventure",
      image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      duration: { nights: 7, days: 8 },
      priceRange: { min: 2500, max: 3200, currency: "$" },
      highlights: [
        { type: "hotel", text: "Mountain chalets with panoramic views" },
        { type: "flight", text: "Direct flights with premium carriers" },
        { type: "cruise", text: "Lake Geneva sightseeing cruise" }
      ],
      bookingOptions: [
        { name: "Booking.com", logo: "/booking.png", url: "https://www.booking.com" },
        { name: "Agoda", logo: "/agoda.png", url: "https://www.agoda.com" }
      ]
    },
    {
      id: "maldives-retreat",
      name: "Maldives Retreat",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      duration: { nights: 6, days: 7 },
      priceRange: { min: 3000, max: 4500, currency: "$" },
      highlights: [
        { type: "hotel", text: "Overwater villas with private pools" },
        { type: "flight", text: "Business class flights with top airlines" },
        { type: "cruise", text: "Sunset dolphin watching excursion" }
      ],
      bookingOptions: [
        { name: "Expedia", logo: "/expedia.png", url: "https://www.expedia.com" },
        { name: "Booking.com", logo: "/booking.png", url: "https://www.booking.com" }
      ]
    },
    {
      id: "japan-cherry-blossom",
      name: "Japan Cherry Blossom Tour",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      duration: { nights: 9, days: 10 },
      priceRange: { min: 2800, max: 3600, currency: "$" },
      highlights: [
        { type: "hotel", text: "Traditional ryokans and modern hotels" },
        { type: "flight", text: "Premium economy seats with extra legroom" },
        { type: "cruise", text: "Tokyo Bay evening dinner cruise" }
      ],
      bookingOptions: [
        { name: "MakeMyTrip", logo: "/makemytrip.png", url: "https://www.makemytrip.com" },
        { name: "Agoda", logo: "/agoda.png", url: "https://www.agoda.com" }
      ]
    },
    {
      id: "santorini-getaway",
      name: "Santorini Getaway",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      duration: { nights: 5, days: 6 },
      priceRange: { min: 1800, max: 2400, currency: "$" },
      highlights: [
        { type: "hotel", text: "Cliffside suite with caldera views" },
        { type: "flight", text: "Direct flights with premium carriers" },
        { type: "cruise", text: "Volcanic islands catamaran tour" }
      ],
      bookingOptions: [
        { name: "Booking.com", logo: "/booking.png", url: "https://www.booking.com" },
        { name: "Expedia", logo: "/expedia.png", url: "https://www.expedia.com" }
      ]
    },
    {
      id: "amazon-expedition",
      name: "Amazon Rainforest Expedition",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      duration: { nights: 8, days: 9 },
      priceRange: { min: 2200, max: 3000, currency: "$" },
      highlights: [
        { type: "hotel", text: "Eco-friendly jungle lodges and river boats" },
        { type: "flight", text: "International and domestic flights included" },
        { type: "cruise", text: "Amazon River wildlife spotting cruise" }
      ],
      bookingOptions: [
        { name: "MakeMyTrip", logo: "/makemytrip.png", url: "https://www.makemytrip.com" },
        { name: "Agoda", logo: "/agoda.png", url: "https://www.agoda.com" }
      ]
    }
  ];

  const handleLogoClick = () => {
    navigate("/travel-preference");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative page-transition">
      <BackgroundImage fullHeight={false} />
      
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Back button */}
        <div className="absolute top-6 left-6 z-30">
          <BackButton to="/travel-preference" />
        </div>
        
        {/* Logo at top center - same as in self planning page */}
        <div className="pt-6 flex justify-center">
          <div 
            onClick={handleLogoClick}
            className="glassmorphism p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <Logo />
          </div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gradient-primary bg-gradient-to-r from-vander-teal to-vander-blue mb-2 text-center">
              Explore Holiday Packages
            </h1>
            <p className="text-center text-vander-gray mb-8">
              Discover curated travel experiences for your next adventure
            </p>
            
            {/* Grid of destination cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <HolidayPackageCard key={pkg.id} packageData={pkg} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayPackages;
