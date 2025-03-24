from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# Configure Gemini API
genai.configure(api_key="AIzaSyAj-KzHyzycqu0hvdDfQ6fyLLuSfWHoHwA")

# Initialize the model
model = genai.GenerativeModel('Gemini 2.0 Flash')

# Initialize conversation state
conversation_state = {
    "step": "greet",
    "mood": None,
    "current_location": None,
    "days": None,
    "budget": None,
    "destination": None,
    "itinerary": None  # To store the generated itinerary
}

# Function to generate responses using Gemini
def generate_response(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating response: {e}"

# Function to suggest destinations based on mood and budget
def suggest_destinations(mood, budget):
    prompt = (
        f"Suggest 3 travel destinations for someone in a {mood} mood with a budget of {budget} INR. "
        "Include a brief description of each destination and why it fits the mood and budget."
    )
    return generate_response(prompt)

# Function to generate itinerary
def generate_itinerary(destination, days, budget, current_location):
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

# Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/chat', methods=['POST'])
def chat():
    global conversation_state
    user_input = request.json.get('message')

    if conversation_state["step"] == "greet":
        response = "Choose one of the following moods:\n1. Adventurous\n2. Relaxed\n3. Cultural\n4. Romantic\n5. Family-friendly\n6. Luxury\n7. Budget-friendly\n8. Spiritual"
        conversation_state["step"] = "get_mood"

    elif conversation_state["step"] == "ask_mood":
        response = (
            "Great! Let's plan your trip. How are you feeling today? Choose one of the following moods:\n"
            "1. Adventurous\n2. Relaxed\n3. Cultural\n4. Romantic\n5. Family-friendly\n6. Luxury\n7. Budget-friendly\n8. Spiritual"
        )
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
        if user_input in mood_map:
            conversation_state["mood"] = mood_map[user_input]
            response = "Great! Where are you currently located?"
            conversation_state["step"] = "ask_location"
        else:
            response = "Invalid choice. Please select a number from 1 to 8."

    elif conversation_state["step"] == "ask_location":
        conversation_state["current_location"] = user_input
        response = "How many days are you planning for your trip?"
        conversation_state["step"] = "ask_days"

    elif conversation_state["step"] == "ask_days":
        conversation_state["days"] = user_input
        response = "What's your budget for the trip in Indian Rupees?"
        conversation_state["step"] = "ask_budget"

    elif conversation_state["step"] == "ask_budget":
        conversation_state["budget"] = user_input
        response = "give the Destination"
        conversation_state["step"] = "ask_destination"

    elif conversation_state["step"] == "ask_destination":
        if user_input.lower() in ["no", "not sure", "unsure", "suggest"]:
            response = suggest_destinations(conversation_state["mood"], conversation_state["budget"])
            response += "\n\nPlease choose one of these destinations or let me know if you have another in mind!"
            conversation_state["step"] = "choose_destination"
        else:
            conversation_state["destination"] = user_input
            # Generate itinerary
            itinerary = generate_itinerary(
                conversation_state["destination"],
                conversation_state["days"],
                conversation_state["budget"],
                conversation_state["current_location"]
            )
            conversation_state["itinerary"] = itinerary  # Store the itinerary
            response = itinerary + "\n\nWould you like to add this itinerary to your plans? (yes/no)"
            conversation_state["step"] = "ask_add_to_plans"

    elif conversation_state["step"] == "choose_destination":
        conversation_state["destination"] = user_input
        # Generate itinerary
        itinerary = generate_itinerary(
            conversation_state["destination"],
            conversation_state["days"],
            conversation_state["budget"],
            conversation_state["current_location"]
        )
        conversation_state["itinerary"] = itinerary  # Store the itinerary
        response = itinerary + "\n\nWould you like to add this itinerary to your plans? (yes/no)"
        conversation_state["step"] = "ask_add_to_plans"

    elif conversation_state["step"] == "ask_add_to_plans":
        if user_input.lower() in ["yes", "y"]:
            # Add the itinerary to plans (you can implement this logic)
            response = "Great! The itinerary has been added to your plans. Is there anything else I can help you with?"
        elif user_input.lower() in ["no", "n"]:
            response = "Okay, the itinerary has not been added. Is there anything else I can help you with?"
        else:
            response = "Please answer with 'yes' or 'no'."
        # Reset conversation state
        conversation_state = {"step": "greet"}

    else:
        response = "Sorry, I didn't understand that. Can you please repeat?"

    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 