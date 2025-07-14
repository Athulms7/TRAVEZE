from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import traceback
import time

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:8080",
            "http://localhost:3000",
            "http://localhost:5173",
            "https://*.vercel.app"  # Allow all Vercel deployments
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure Gemini API
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    print("Error: GOOGLE_API_KEY not found in environment variables")
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    print("Gemini API configured successfully")
except Exception as e:
    print(f"Error configuring Gemini API: {str(e)}")
    raise

# Initialize conversation state
conversation_state = {
    "step": "greet",
    "mood": None,
    "current_location": None,
    "days": None,
    "budget": None,
    "destination": None,
    "itinerary": None
}

# Function to generate responses using Gemini
def generate_response(prompt):
    try:
        response = model.generate_content(prompt)
        if not response or not response.text:
            raise Exception("Empty response from Gemini API")
        return response.text
    except Exception as e:
        print(f"Error generating response: {e}")
        return f"I apologize, but I'm having trouble generating a response at the moment. Please try again in a few moments."

# Function to suggest destinations based on mood and budget
def suggest_destinations(mood, budget):
    try:
        prompt = (
            f"Suggest 3 travel destinations for someone in a {mood} mood with a budget of {budget} INR. "
            "Include a brief description of each destination and why it fits the mood and budget."
        )
        return generate_response(prompt)
    except Exception as e:
        print(f"Error suggesting destinations: {e}")
        return "I apologize, but I'm having trouble suggesting destinations at the moment. Please try again in a few moments."

# Function to generate itinerary
def generate_itinerary(destination, days, budget, current_location):
    try:
        prompt = (
            f"Create a {days}-day itinerary for a trip to {destination} from {current_location} with a budget of {budget} INR. "
            "Format the itinerary EXACTLY like this:\n\n"
            "Day 1\n"
            "08:00 AM - Activity\n"
            "10:00 AM - Activity\n"
            "01:00 PM - Activity\n"
            "02:30 PM - Activity\n"
            "05:00 PM - Activity\n"
            "07:00 PM - Activity\n"
            "08:30 PM - Activity\n\n"
            "Day 2\n"
            "09:00 AM - Activity\n"
            "10:00 AM - Activity\n"
            "01:00 PM - Activity\n"
            "02:30 PM - Activity\n"
            "05:00 PM - Activity\n"
            "06:30 PM - Activity\n"
            "08:00 PM - Activity\n\n"
            "Backpack Items: item1, item2, item3"
        )
        itinerary = generate_response(prompt)
        
        # Post-process response to strictly match layout
        itinerary_lines = itinerary.split('\n')
        structured_itinerary = []
        for line in itinerary_lines:
            if line.strip():  # Skip empty lines
                structured_itinerary.append(line.strip())
        
        return '\n'.join(structured_itinerary)
    except Exception as e:
        print(f"Error generating itinerary: {e}")
        return "I apologize, but I'm having trouble generating the itinerary at the moment. Please try again in a few moments."

@app.route('/chat', methods=['POST'])
def chat():
    global conversation_state
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        print(f"Received message: {user_message}")  # Debug log

        if conversation_state["step"] == "greet":
            response = "Welcome to your travel planning assistant! Let me help you plan your perfect trip."
            conversation_state["step"] = "ask_mood"

        elif conversation_state["step"] == "ask_mood":
            response = ("Choose one of the following moods:\n"
                "1. Adventurous\n2. Relaxed\n3. Cultural\n4. Romantic\n5. Family-friendly\n6. Luxury\n7. Budget-friendly\n8. Spiritual")
            conversation_state["step"] = "get_mood"

        elif conversation_state["step"] == "get_mood":
            mood_map = {
                "1": "adventurous",
                "2": "relaxed",
                "3": "cultural",
                "4": "romantic",
                "5": "family-friendly",
                "6": "luxury",
                "7": "budget-friendly",
                "8": "spiritual",
            }
            if user_message in mood_map:
                conversation_state["mood"] = mood_map[user_message]
                response = "Great! Where are you currently located?"
                conversation_state["step"] = "ask_location"
            else:
                response = "Invalid choice. Please select a number from 1 to 8."

        elif conversation_state["step"] == "ask_location":
            conversation_state["current_location"] = user_message
            response = "How many days are you planning for your trip?"
            conversation_state["step"] = "ask_days"

        elif conversation_state["step"] == "ask_days":
            conversation_state["days"] = user_message
            response = "What's your budget for the trip in Indian Rupees?"
            conversation_state["step"] = "ask_budget"

        elif conversation_state["step"] == "ask_budget":
            conversation_state["budget"] = user_message
            response = "give the destination :"
            conversation_state["step"] = "ask_destination"

        elif conversation_state["step"] == "ask_destination":
            if user_message.lower() in ["no", "not sure", "unsure", "suggest"]:
                response = suggest_destinations(conversation_state["mood"], conversation_state["budget"])
                response += "\n\nPlease choose one of these destinations or let me know if you have another in mind!"
                conversation_state["step"] = "choose_destination"
            else:
                conversation_state["destination"] = user_message
                itinerary = generate_itinerary(
                    conversation_state["destination"],
                    conversation_state["days"],
                    conversation_state["budget"],
                    conversation_state["current_location"]
                )
                conversation_state["itinerary"] = itinerary
                response = itinerary + "\n\nWould you like to add this itinerary to your plans? (yes/no)"
                conversation_state["step"] = "ask_add_to_plans"

        elif conversation_state["step"] == "choose_destination":
            conversation_state["destination"] = user_message
            itinerary = generate_itinerary(
                conversation_state["destination"],
                conversation_state["days"],
                conversation_state["budget"],
                conversation_state["current_location"]
            )
            conversation_state["itinerary"] = itinerary
            response = itinerary + "\n\nWould you like to add this itinerary to your plans? (yes/no)"
            conversation_state["step"] = "ask_add_to_plans"

        elif conversation_state["step"] == "ask_add_to_plans":
            if user_message.lower() in ["yes", "y"]:
                response = "Great! The itinerary has been added to your plans. Is there anything else I can help you with?"
            elif user_message.lower() in ["no", "n"]:
                response = "Okay, the itinerary has not been added. Is there anything else I can help you with?"
            else:
                response = "Please answer with 'yes' or 'no'."
            # Reset conversation state
            conversation_state = {"step": "greet"}

        else:
            response = "Sorry, I didn't understand that. Can you please repeat?"

        print(f"Generated response: {response}")  # Debug log
        return jsonify({"response": response})

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        print("Traceback:")
        print(traceback.format_exc())
        return jsonify({'error': 'An unexpected error occurred. Please try again.'}), 500

@app.route('/welcome', methods=['GET'])
def welcome():
    try:
        return jsonify({
            'response': "Welcome to your travel planning assistant! Let me help you plan your perfect trip."
        })
    except Exception as e:
        print(f"Error in welcome endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    try:
        # Test Gemini API connection
        test_response = model.generate_content("test")
        if not test_response or not test_response.text:
            raise Exception("Empty response from Gemini API")
        return jsonify({
            'status': 'healthy',
            'gemini_api': 'connected',
            'timestamp': time.time()
        })
    except Exception as e:
        print(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': time.time()
        }), 500

if __name__ == '__main__':
    # For local development
    app.run(debug=True, port=5051) 