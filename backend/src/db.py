from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
client = MongoClient(MONGODB_URI)
db = client['vander_db']
itineraries_collection = db['itineraries']

# Sample itineraries data
sample_itineraries = [
    {
        "id": "paris-2023",
        "title": "Paris Adventure",
        "location": "Paris, France",
        "duration": "5 days",
        "image": "https://images.unsplash.com/photo-1502602898657-4654415f7ce4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "startDate": "June 15, 2023",
        "endDate": "June 20, 2023",
        "budget": {
            "total": "€1,500",
            "accommodation": "€600",
            "food": "€300",
            "transport": "€200",
            "activities": "€400"
        },
        "transportation": [
            {
                "type": "flight",
                "name": "Air France",
                "from": "New York JFK",
                "to": "Paris CDG",
                "departureTime": "10:30 AM",
                "arrivalTime": "11:45 PM",
                "date": "June 15, 2023"
            },
            {
                "type": "train",
                "name": "Paris Metro",
                "description": "Public transport within Paris"
            },
            {
                "type": "bus",
                "name": "City Bus Tours",
                "description": "Hop on/off sightseeing tours"
            }
        ],
        "dayPlans": [
            {
                "day": 1,
                "date": "June 15, 2023",
                "activities": [
                    {"time": "12:30 PM", "activity": "Arrive at CDG Airport"},
                    {"time": "2:00 PM", "activity": "Check-in at Hotel Lutetia"},
                    {"time": "4:00 PM", "activity": "Afternoon walk along Seine River"},
                    {"time": "7:00 PM", "activity": "Dinner at Le Petit Bistro"}
                ]
            },
            {
                "day": 2,
                "date": "June 16, 2023",
                "activities": [
                    {"time": "8:00 AM", "activity": "Breakfast at hotel"},
                    {"time": "10:00 AM", "activity": "Visit Eiffel Tower"},
                    {"time": "1:00 PM", "activity": "Lunch at Café de la Tour"},
                    {"time": "3:00 PM", "activity": "Louvre Museum tour"},
                    {"time": "7:30 PM", "activity": "Seine River dinner cruise"}
                ]
            }
        ],
        "packingList": [
            "Passport and travel documents",
            "Euros (cash) and credit cards",
            "European power adapter",
            "Light raincoat (Paris can be rainy)",
            "Comfortable walking shoes",
            "Smart casual outfits for restaurants",
            "Camera equipment",
            "Medications and first aid kit",
            "Sunglasses and sunscreen",
            "French phrasebook or translation app"
        ]
    },
    {
        "id": "tokyo-2023",
        "title": "Tokyo Exploration",
        "location": "Tokyo, Japan",
        "duration": "7 days",
        "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "startDate": "July 10, 2023",
        "endDate": "July 17, 2023",
        "budget": {
            "total": "¥200,000",
            "accommodation": "¥70,000",
            "food": "¥50,000",
            "transport": "¥30,000",
            "activities": "¥50,000"
        },
        "transportation": [
            {
                "type": "flight",
                "name": "JAL",
                "from": "San Francisco SFO",
                "to": "Tokyo NRT",
                "departureTime": "1:30 PM",
                "arrivalTime": "5:45 PM",
                "date": "July 10, 2023"
            },
            {
                "type": "train",
                "name": "Tokyo Metro & JR Lines",
                "description": "Comprehensive subway system"
            },
            {
                "type": "bus",
                "name": "Tokyo Sightseeing Bus",
                "description": "City tour bus services"
            }
        ],
        "dayPlans": [
            {
                "day": 1,
                "date": "July 10, 2023",
                "activities": [
                    {"time": "5:45 PM", "activity": "Arrive at Narita Airport"},
                    {"time": "7:30 PM", "activity": "Check-in at Shinjuku Hotel"},
                    {"time": "9:00 PM", "activity": "Dinner at local ramen shop"}
                ]
            },
            {
                "day": 2,
                "date": "July 11, 2023",
                "activities": [
                    {"time": "8:00 AM", "activity": "Breakfast at hotel"},
                    {"time": "10:00 AM", "activity": "Visit Meiji Shrine"},
                    {"time": "1:00 PM", "activity": "Explore Harajuku & lunch"},
                    {"time": "4:00 PM", "activity": "Shopping in Shibuya"},
                    {"time": "7:00 PM", "activity": "Dinner at Izakaya"}
                ]
            }
        ],
        "packingList": [
            "Passport and travel documents",
            "Japanese Yen (cash) - Japan is still largely cash-based",
            "JR Pass (if purchased in advance)",
            "Power adapter for Japan",
            "Comfortable walking shoes",
            "Light, modest clothing for temples",
            "Portable Wi-Fi or SIM card",
            "Hand towel (many public restrooms don't have towels)",
            "Translation app or pocket dictionary",
            "Medications and first aid kit"
        ]
    },
    {
        "id": "bali-2023",
        "title": "Bali Retreat",
        "location": "Bali, Indonesia",
        "duration": "10 days",
        "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "startDate": "August 5, 2023",
        "endDate": "August 15, 2023",
        "budget": {
            "total": "Rp 15,000,000",
            "accommodation": "Rp 6,000,000",
            "food": "Rp 3,000,000",
            "transport": "Rp 2,000,000",
            "activities": "Rp 4,000,000"
        },
        "transportation": [
            {
                "type": "flight",
                "name": "Garuda Indonesia",
                "from": "Singapore Changi",
                "to": "Denpasar DPS",
                "departureTime": "11:30 AM",
                "arrivalTime": "2:15 PM",
                "date": "August 5, 2023"
            },
            {
                "type": "car",
                "name": "Private driver",
                "description": "Hired car with driver for the trip"
            }
        ],
        "dayPlans": [
            {
                "day": 1,
                "date": "August 5, 2023",
                "activities": [
                    {"time": "2:15 PM", "activity": "Arrive at Ngurah Rai Airport"},
                    {"time": "4:00 PM", "activity": "Check-in at Ubud Resort"},
                    {"time": "6:00 PM", "activity": "Welcome dinner at resort"}
                ]
            },
            {
                "day": 2,
                "date": "August 6, 2023",
                "activities": [
                    {"time": "7:00 AM", "activity": "Sunrise yoga session"},
                    {"time": "9:00 AM", "activity": "Breakfast at resort"},
                    {"time": "11:00 AM", "activity": "Visit Sacred Monkey Forest"},
                    {"time": "2:00 PM", "activity": "Lunch at organic café"},
                    {"time": "4:00 PM", "activity": "Spa treatment"}
                ]
            }
        ],
        "packingList": [
            "Passport and travel documents",
            "Indonesian Rupiah (cash)",
            "Light, breathable clothing",
            "Swimwear and beach essentials",
            "Insect repellent (high DEET)",
            "Sunscreen and after-sun care",
            "Comfortable sandals and walking shoes",
            "Modest clothing for temple visits",
            "Reusable water bottle",
            "Medications and first aid kit"
        ]
    },
    {
        "id": "nyc-2023",
        "title": "New York City Tour",
        "location": "New York, USA",
        "duration": "4 days",
        "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "startDate": "September 20, 2023",
        "endDate": "September 24, 2023",
        "budget": {
            "total": "$2,000",
            "accommodation": "$800",
            "food": "$400",
            "transport": "$200",
            "activities": "$600"
        },
        "transportation": [
            {
                "type": "flight",
                "name": "Delta Airlines",
                "from": "Chicago ORD",
                "to": "New York JFK",
                "departureTime": "9:30 AM",
                "arrivalTime": "12:45 PM",
                "date": "September 20, 2023"
            },
            {
                "type": "subway",
                "name": "NYC Subway",
                "description": "Extensive subway system"
            },
            {
                "type": "bus",
                "name": "NYC Bus System",
                "description": "City buses"
            }
        ],
        "dayPlans": [
            {
                "day": 1,
                "date": "September 20, 2023",
                "activities": [
                    {"time": "12:45 PM", "activity": "Arrive at JFK Airport"},
                    {"time": "2:30 PM", "activity": "Check-in at Manhattan Hotel"},
                    {"time": "4:00 PM", "activity": "Walk through Times Square"},
                    {"time": "7:00 PM", "activity": "Dinner in Midtown"}
                ]
            },
            {
                "day": 2,
                "date": "September 21, 2023",
                "activities": [
                    {"time": "8:00 AM", "activity": "Breakfast at hotel"},
                    {"time": "10:00 AM", "activity": "Visit Statue of Liberty & Ellis Island"},
                    {"time": "2:00 PM", "activity": "Lunch in Financial District"},
                    {"time": "4:00 PM", "activity": "9/11 Memorial & Museum"},
                    {"time": "7:30 PM", "activity": "Dinner in Little Italy"}
                ]
            }
        ],
        "packingList": [
            "Passport or ID (for domestic travel)",
            "Comfortable walking shoes (you'll walk a lot)",
            "Weather-appropriate clothing (check forecast)",
            "Light jacket for evenings",
            "Metro card or payment method for subway",
            "Camera equipment",
            "Portable battery charger",
            "City map or offline map app",
            "Medications and first aid kit",
            "Earplugs (NYC can be noisy at night)"
        ]
    }
]

def init_db():
    """Initialize the database with sample data if empty"""
    try:
        # Check if collection is empty
        if itineraries_collection.count_documents({}) == 0:
            # Insert sample itineraries
            itineraries_collection.insert_many(sample_itineraries)
            print("Sample itineraries added to database successfully")
        else:
            print("Database already contains itineraries")
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        raise

def get_all_itineraries():
    """Get all itineraries from the database"""
    try:
        return list(itineraries_collection.find({}, {'_id': 0}))
    except Exception as e:
        print(f"Error fetching itineraries: {str(e)}")
        raise

def get_itinerary_by_id(itinerary_id):
    """Get a specific itinerary by ID"""
    try:
        return itineraries_collection.find_one({"id": itinerary_id}, {'_id': 0})
    except Exception as e:
        print(f"Error fetching itinerary: {str(e)}")
        raise 