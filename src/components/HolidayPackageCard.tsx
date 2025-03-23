
import React from "react";
import { Clock, Tag, Hotel, Plane, Ship } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageHighlight {
  type: 'hotel' | 'flight' | 'cruise';
  text: string;
}

export interface HolidayPackage {
  id: string;
  name: string;
  image: string;
  duration: {
    days: number;
    nights: number;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  highlights: PackageHighlight[];
  bookingOptions: {
    name: string;
    logo: string;
    url: string;
  }[];
}

interface HolidayPackageCardProps {
  packageData: HolidayPackage;
  className?: string;
}

const HolidayPackageCard: React.FC<HolidayPackageCardProps> = ({ packageData, className }) => {
  const { name, image, duration, priceRange, highlights, bookingOptions } = packageData;

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <Hotel size={16} className="text-vander-blue" />;
      case 'flight':
        return <Plane size={16} className="text-vander-teal" />;
      case 'cruise':
        return <Ship size={16} className="text-vander-green" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "glassmorphism rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full",
      className
    )}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-xl font-semibold">{name}</h3>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-vander-dark">
            <Clock size={16} />
            <span className="text-sm">{duration.nights} Nights / {duration.days} Days</span>
          </div>
          <div className="flex items-center gap-1 text-vander-dark">
            <Tag size={16} />
            <span className="text-sm font-medium">{priceRange.currency}{priceRange.min.toLocaleString()} - {priceRange.currency}{priceRange.max.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-vander-dark mb-2">Package Highlights:</h4>
          <div className="space-y-1">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2">
                {getHighlightIcon(highlight.type)}
                <span className="text-xs text-vander-gray">{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <h4 className="text-sm font-medium text-vander-dark mb-2">Book via:</h4>
          <div className="flex flex-wrap gap-2">
            {bookingOptions.map((option, index) => (
              <a 
                key={index}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="vander-button px-3 py-2 text-xs flex items-center gap-1 flex-1 justify-center"
              >
                <img src={option.logo} alt={option.name} className="w-4 h-4" />
                <span>{option.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayPackageCard;
