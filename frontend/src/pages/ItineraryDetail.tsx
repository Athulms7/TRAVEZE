// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Calendar, Clock, MapPin, Plane, Bus, Train, Ship, Wallet, Sunrise, Coffee, Utensils, Camera, Briefcase } from "lucide-react";
// import BackgroundImage from "../components/BackgroundImage";
// import Weather from "../components/Weather";
// import Map from "../components/Map";
// import { useEffect, useState } from "react";

// interface Place {
//   name: string;
//   location: string;
//   type: 'activity' | 'transportation' | 'accommodation';
// }

// interface FlightTransport {
//   type: "flight";
//   name: string;
//   from: string;
//   to: string;
//   departureTime: string;
//   arrivalTime: string;
//   date: string;
//   icon: typeof Plane;
// }

// interface OtherTransport {
//   type: "train" | "bus" | "subway" | "car";
//   name: string;
//   description: string;
//   icon: typeof Train | typeof Bus;
// }

// type Transport = FlightTransport | OtherTransport;

// // Sample itineraries data with detailed information
// const itinerariesData = {
//   "paris-2023": {
//     title: "Paris Adventure",
//     location: "Paris, France",
//     duration: "5 days",
//     image: "https://images.unsplash.com/photo-1502602898657-4654415f7ce4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     startDate: "June 15, 2023",
//     endDate: "June 20, 2023",
//     budget: {
//       total: "₹1,35,000",
//       accommodation: "₹54,000",
//       food: "₹27,000",
//       transport: "₹18,000",
//       activities: "₹36,000"
//     },
//     transportation: [
//       { type: "flight", name: "Air France", from: "New York JFK", to: "Paris CDG", departureTime: "10:30 AM", arrivalTime: "11:45 PM", date: "June 15, 2023", icon: Plane },
//       { type: "train", name: "Paris Metro", description: "Public transport within Paris", icon: Train },
//       { type: "bus", name: "City Bus Tours", description: "Hop on/off sightseeing tours", icon: Bus }
//     ],
//     dayPlans: [
//       {
//         day: 1,
//         date: "June 15, 2023",
//         activities: [
//           { time: "12:30 PM", activity: "Arrive at CDG Airport", icon: Plane },
//           { time: "2:00 PM", activity: "Check-in at Hotel Lutetia", icon: Briefcase },
//           { time: "4:00 PM", activity: "Afternoon walk along Seine River", icon: Coffee },
//           { time: "7:00 PM", activity: "Dinner at Le Petit Bistro", icon: Utensils }
//         ]
//       },
//       {
//         day: 2,
//         date: "June 16, 2023",
//         activities: [
//           { time: "8:00 AM", activity: "Breakfast at hotel", icon: Coffee },
//           { time: "10:00 AM", activity: "Visit Eiffel Tower", icon: Camera },
//           { time: "1:00 PM", activity: "Lunch at Café de la Tour", icon: Utensils },
//           { time: "3:00 PM", activity: "Louvre Museum tour", icon: Camera },
//           { time: "7:30 PM", activity: "Seine River dinner cruise", icon: Ship }
//         ]
//       },
//       {
//         day: 3,
//         date: "June 17, 2023",
//         activities: [
//           { time: "9:00 AM", activity: "Visit Montmartre & Sacré-Cœur", icon: Camera },
//           { time: "1:00 PM", activity: "Lunch at La Maison Rose", icon: Utensils },
//           { time: "3:00 PM", activity: "Musée d'Orsay visit", icon: Camera },
//           { time: "8:00 PM", activity: "Dinner & show at Moulin Rouge", icon: Utensils }
//         ]
//       }
//     ],
//     packingList: [
//       "Passport and travel documents",
//       "Euros (cash) and credit cards",
//       "European power adapter",
//       "Light raincoat (Paris can be rainy)",
//       "Comfortable walking shoes",
//       "Smart casual outfits for restaurants",
//       "Camera equipment",
//       "Medications and first aid kit",
//       "Sunglasses and sunscreen",
//       "French phrasebook or translation app"
//     ]
//   },
//   "tokyo-2023": {
//     title: "Tokyo Exploration",
//     location: "Tokyo, Japan",
//     duration: "7 days",
//     image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     startDate: "July 10, 2023",
//     endDate: "July 17, 2023",
//     budget: {
//       total: "₹1,20,000",
//       accommodation: "₹42,000",
//       food: "₹30,000",
//       transport: "₹18,000",
//       activities: "₹30,000"
//     },
//     transportation: [
//       { type: "flight", name: "JAL", from: "San Francisco SFO", to: "Tokyo NRT", departureTime: "1:30 PM", arrivalTime: "5:45 PM", date: "July 10, 2023", icon: Plane },
//       { type: "train", name: "Tokyo Metro & JR Lines", description: "Comprehensive subway system", icon: Train },
//       { type: "bus", name: "Tokyo Sightseeing Bus", description: "City tour bus services", icon: Bus }
//     ],
//     dayPlans: [
//       {
//         day: 1,
//         date: "July 10, 2023",
//         activities: [
//           { time: "5:45 PM", activity: "Arrive at Narita Airport", icon: Plane },
//           { time: "7:30 PM", activity: "Check-in at Shinjuku Hotel", icon: Briefcase },
//           { time: "9:00 PM", activity: "Dinner at local ramen shop", icon: Utensils }
//         ]
//       },
//       {
//         day: 2,
//         date: "July 11, 2023",
//         activities: [
//           { time: "8:00 AM", activity: "Breakfast at hotel", icon: Coffee },
//           { time: "10:00 AM", activity: "Visit Meiji Shrine", icon: Camera },
//           { time: "1:00 PM", activity: "Explore Harajuku & lunch", icon: Utensils },
//           { time: "4:00 PM", activity: "Shopping in Shibuya", icon: Briefcase },
//           { time: "7:00 PM", activity: "Dinner at Izakaya", icon: Utensils }
//         ]
//       },
//       {
//         day: 3,
//         date: "July 12, 2023",
//         activities: [
//           { time: "6:00 AM", activity: "Tsukiji Outer Market tour", icon: Coffee },
//           { time: "10:00 AM", activity: "Visit Senso-ji Temple", icon: Camera },
//           { time: "1:00 PM", activity: "Lunch in Asakusa", icon: Utensils },
//           { time: "3:00 PM", activity: "Tokyo Skytree observation", icon: Camera },
//           { time: "7:00 PM", activity: "Dinner cruise on Sumida River", icon: Ship }
//         ]
//       }
//     ],
//     packingList: [
//       "Passport and travel documents",
//       "Japanese Yen (cash) - Japan is still largely cash-based",
//       "JR Pass (if purchased in advance)",
//       "Power adapter for Japan",
//       "Comfortable walking shoes",
//       "Light, modest clothing for temples",
//       "Portable Wi-Fi or SIM card",
//       "Hand towel (many public restrooms don't have towels)",
//       "Translation app or pocket dictionary",
//       "Medications and first aid kit"
//     ]
//   },
//   "bali-2023": {
//     title: "Bali Retreat",
//     location: "Bali, Indonesia",
//     duration: "10 days",
//     image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     startDate: "August 5, 2023",
//     endDate: "August 15, 2023",
//     budget: {
//       total: "₹90,000",
//       accommodation: "₹36,000",
//       food: "₹18,000",
//       transport: "₹12,000",
//       activities: "₹24,000"
//     },
//     transportation: [
//       { type: "flight", name: "Garuda Indonesia", from: "Singapore Changi", to: "Denpasar DPS", departureTime: "11:30 AM", arrivalTime: "2:15 PM", date: "August 5, 2023", icon: Plane },
//       { type: "car", name: "Private driver", description: "Hired car with driver for the trip", icon: Bus }
//     ],
//     dayPlans: [
//       {
//         day: 1,
//         date: "August 5, 2023",
//         activities: [
//           { time: "2:15 PM", activity: "Arrive at Ngurah Rai Airport", icon: Plane },
//           { time: "4:00 PM", activity: "Check-in at Ubud Resort", icon: Briefcase },
//           { time: "6:00 PM", activity: "Welcome dinner at resort", icon: Utensils }
//         ]
//       },
//       {
//         day: 2,
//         date: "August 6, 2023",
//         activities: [
//           { time: "7:00 AM", activity: "Sunrise yoga session", icon: Sunrise },
//           { time: "9:00 AM", activity: "Breakfast at resort", icon: Coffee },
//           { time: "11:00 AM", activity: "Visit Sacred Monkey Forest", icon: Camera },
//           { time: "2:00 PM", activity: "Lunch at organic café", icon: Utensils },
//           { time: "4:00 PM", activity: "Spa treatment", icon: Coffee }
//         ]
//       },
//       {
//         day: 3,
//         date: "August 7, 2023",
//         activities: [
//           { time: "8:00 AM", activity: "Breakfast at resort", icon: Coffee },
//           { time: "10:00 AM", activity: "Tour of Tegallalang Rice Terraces", icon: Camera },
//           { time: "1:00 PM", activity: "Lunch overlooking rice fields", icon: Utensils },
//           { time: "3:00 PM", activity: "Visit Tirta Empul Temple", icon: Camera },
//           { time: "7:00 PM", activity: "Dinner in Ubud center", icon: Utensils }
//         ]
//       }
//     ],
//     packingList: [
//       "Passport and travel documents",
//       "Indonesian Rupiah (cash)",
//       "Light, breathable clothing",
//       "Swimwear and beach essentials",
//       "Insect repellent (high DEET)",
//       "Sunscreen and after-sun care",
//       "Comfortable sandals and walking shoes",
//       "Modest clothing for temple visits",
//       "Reusable water bottle",
//       "Medications and first aid kit"
//     ]
//   },
//   "nyc-2023": {
//     title: "New York City Tour",
//     location: "New York, USA",
//     duration: "4 days",
//     image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     startDate: "September 20, 2023",
//     endDate: "September 24, 2023",
//     budget: {
//       total: "₹1,80,000",
//       accommodation: "₹72,000",
//       food: "₹36,000",
//       transport: "₹18,000",
//       activities: "₹54,000"
//     },
//     transportation: [
//       { type: "flight", name: "Delta Airlines", from: "Chicago ORD", to: "New York JFK", departureTime: "9:30 AM", arrivalTime: "12:45 PM", date: "September 20, 2023", icon: Plane },
//       { type: "subway", name: "NYC Subway", description: "Extensive subway system", icon: Train },
//       { type: "bus", name: "NYC Bus System", description: "City buses", icon: Bus }
//     ],
//     dayPlans: [
//       {
//         day: 1,
//         date: "September 20, 2023",
//         activities: [
//           { time: "12:45 PM", activity: "Arrive at JFK Airport", icon: Plane },
//           { time: "2:30 PM", activity: "Check-in at Manhattan Hotel", icon: Briefcase },
//           { time: "4:00 PM", activity: "Walk through Times Square", icon: Camera },
//           { time: "7:00 PM", activity: "Dinner in Midtown", icon: Utensils }
//         ]
//       },
//       {
//         day: 2,
//         date: "September 21, 2023",
//         activities: [
//           { time: "8:00 AM", activity: "Breakfast at hotel", icon: Coffee },
//           { time: "10:00 AM", activity: "Visit Statue of Liberty & Ellis Island", icon: Ship },
//           { time: "2:00 PM", activity: "Lunch in Financial District", icon: Utensils },
//           { time: "4:00 PM", activity: "9/11 Memorial & Museum", icon: Camera },
//           { time: "7:30 PM", activity: "Dinner in Little Italy", icon: Utensils }
//         ]
//       },
//       {
//         day: 3,
//         date: "September 22, 2023",
//         activities: [
//           { time: "9:00 AM", activity: "Central Park morning walk", icon: Coffee },
//           { time: "11:00 AM", activity: "Metropolitan Museum of Art", icon: Camera },
//           { time: "2:00 PM", activity: "Lunch on Museum Mile", icon: Utensils },
//           { time: "4:00 PM", activity: "Shopping on Fifth Avenue", icon: Briefcase },
//           { time: "8:00 PM", activity: "Broadway show", icon: Camera }
//         ]
//       }
//     ],
//     packingList: [
//       "Passport or ID (for domestic travel)",
//       "Comfortable walking shoes (you'll walk a lot)",
//       "Weather-appropriate clothing (check forecast)",
//       "Light jacket for evenings",
//       "Metro card or payment method for subway",
//       "Camera equipment",
//       "Portable battery charger",
//       "City map or offline map app",
//       "Medications and first aid kit",
//       "Earplugs (NYC can be noisy at night)"
//     ]
//   }
// };


// const ItineraryDetail = () => {
//   const { itineraryId } = useParams<{ itineraryId: string }>();
//   const navigate = useNavigate();
//   const[itenarydata,setItinerary]=useState()
//   console.log(itineraryId)
//   useEffect(()=>{
//     getData()
//     console.log("hiiii")
//   },[])
//  async function getData(){
//     const { itineraryId } = useParams<{ itineraryId: string }>();
//     const token=localStorage.getItem("token") ||""
//      const resp=await fetch(`http://localhost:3000/api/auth/it/${itineraryId}`,{
//       method:"POST",
//       headers:{
//         authorization:token
//       }
//     })
//     const data = await resp.json();
//     setItinerary(data.itenaries);
//     console.log(itenarydata)
//   }
  

//   if (!itineraryId || !itinerariesData[itineraryId as keyof typeof itinerariesData]) {
//     return (
//       <div className="min-h-screen bg-vander-light flex items-center justify-center">
//         <div className="text-center p-8">
//           <h2 className="text-2xl font-bold text-vander-dark mb-4">Itinerary Not Found</h2>
//           <p className="text-vander-gray mb-6">The itinerary you're looking for doesn't exist or has been removed.</p>
//           <button 
//             onClick={() => navigate("/itineraries")}
//             className="Traveze-button px-4 py-2"
//           >
//             Back to Itineraries
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const itinerary = itinerariesData[itineraryId as keyof typeof itinerariesData];

//   // Extract places from the itinerary data
//   const places: Place[] = [
//     ...itinerary.transportation.map(transport => ({
//       name: transport.name,
//       location: transport.type === 'flight' ? transport.to : itinerary.location,
//       type: 'transportation' as const
//     } as Place)),
//     ...itinerary.dayPlans.flatMap(day => 
//       day.activities.map(activity => ({
//         name: activity.activity,
//         location: itinerary.location,
//         type: 'activity' as const
//       } as Place))
//     )
//   ];
 

function Display({ itinerary }: any) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-vander-light">
      <BackgroundImage />
      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="mb-6">
          <button
            onClick={() => navigate("/itineraries")}
            className="flex items-center text-vander-dark hover:text-vander-teal transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Itineraries</span>
          </button>
        </div>

        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <img
            src={itinerary.image}
            alt={itinerary.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{itinerary.title}</h1>
            <div className="flex flex-wrap items-center text-white/90 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <MapPin size={18} className="mr-1" />
                <span>{itinerary.destination}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={18} className="mr-1" />
                <span>{itinerary.numberOfDays} Days</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
         <Weather location={itinerary.destination} />
</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glassmorphism rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-vander-dark mb-4">Daily Plan</h2>
              <div className="space-y-8">
                {itinerary.days.map((day: any, dayIndex: number) => (
                  <div key={dayIndex}>
                    <div className="flex items-center mb-4">
                      <div className="bg-vander-blue/10 text-vander-blue font-semibold rounded-lg px-3 py-1 mr-3">
                        Day {day.day}
                      </div>
                    </div>
                    <div className="pl-4 border-l-2 border-vander-blue/20 space-y-4">
                      {day.activities.map((activity: any, actIndex: number) => (
                        <div key={actIndex} className="flex items-start">
                          <div className="bg-white p-2 rounded-lg shadow-sm mr-4 flex-shrink-0">
                            <Coffee size={18} className="text-vander-teal" />
                          </div>
                          <div>
                            <div className="text-vander-dark font-medium">{activity.time}</div>
                            <div className="text-vander-gray">{activity.activity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-vander-dark mb-4 flex items-center">
                <Wallet size={20} className="mr-2 text-vander-blue" />
                Budget
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-medium text-vander-dark">Total Budget</span>
                  <span className="text-lg font-semibold text-vander-teal">₹ {itinerary.budget}</span>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-vander-dark mb-4 flex items-center">
                <Briefcase size={20} className="mr-2 text-vander-blue" />
                Packing List
              </h2>
              <ul className="space-y-2">
                {itinerary.backpackItems.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-vander-teal/10 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-vander-teal font-medium">{index + 1}</span>
                    </div>
                    <span className="text-vander-gray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Wallet, Coffee, Briefcase } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import Weather from "../components/Weather";
// import Map from "../components/Map";
import { useEffect, useState } from "react";

const ItineraryDetail = () => {
  const { itineraryId } = useParams<{ itineraryId: string }>();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState([])

  useEffect(() => {
    getData();
  }, [itineraryId]);

  async function getData() {
    const token = localStorage.getItem("token") || "";
    try {
      const resp = await fetch(`http://localhost:3000/api/auth/it/${itineraryId}`, {
        method: "POST",
        headers: {
          authorization: token
        }
      });
      const data = await resp.json();
      console.log(data.itenaries)
      if (data?.itenaries) {
        setItinerary(data.itenaries);
        console.log(data)
      }

    } catch (error) {
      console.error(error);
    }
  }
console.log(itineraryId,itinerary)
  if (!itineraryId || !itinerary) {
    return (
      <div className="min-h-screen bg-vander-light flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-vander-dark mb-4">Itinerary Not Found</h2>
          <p className="text-vander-gray mb-6">The itinerary you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/itineraries")}
            className="Traveze-button px-4 py-2"
          >
            Back to Itineraries
          </button>
        </div>
      </div>
    );
  }


 return (
  <div className="min-h-screen bg-vander-light">
    <BackgroundImage />
    <div className="container mx-auto py-8 px-4 relative z-10 space-y-4">
      {itinerary.map((u: any, index: number) => (
        <Display key={index} itinerary={u} />
      ))}
    </div>
  </div>
);

}
export default ItineraryDetail;
