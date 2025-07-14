from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import re
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
import json


load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")


groq = Groq(api_key=groq_api_key)

client = MongoClient("mongodb://localhost:27017/")
db = client["tripwish"]
collection = db["itineraries"]


app = Flask(__name__)
CORS(app)



def generate_itinerary(destination, days, budget, current_location):
    prompt = (
        f"Create a {days}-day itinerary for a trip to {destination} from {current_location} "
        f"with a budget of {budget} INR. "
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
        "Continue this format for all days.\n"
        "At the end, add:\nBackpack Items: item1, item2, item3"
    )

    try:
        response = groq.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful travel assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

def generate_destination_image_url(destination):
   
    return f"https://source.unsplash.com/1600x900/?{destination.replace(' ', '+')},travel"


def parse_itinerary(text, title, source, destination, numberOfDays, budget, user_id):
    days = []
    backpack_items = []
    image_url = generate_destination_image_url(destination)
    lines = text.strip().split("\n")
    current_day = None
    activities = []

    for line in lines:
        line = line.strip()
        if re.match(r"^Day \d+", line):
            if current_day:
                days.append({"day": current_day, "activities": activities})
            current_day = int(re.findall(r'\d+', line)[0])
            activities = []
        elif "Backpack Items:" in line:
            items = line.split("Backpack Items:")[1].split(",")
            backpack_items = [item.strip() for item in items]
        elif re.match(r'^\d{1,2}:\d{2} (AM|PM) - ', line):
            time, activity = line.split(" - ", 1)
            activities.append({"time": time.strip(), "activity": activity.strip()})

    if current_day:
        days.append({"day": current_day, "activities": activities})

   
    if isinstance(user_id, dict):
        user_object_id = ObjectId(user_id["id"])
    elif isinstance(user_id, str):
        user_object_id = ObjectId(user_id)
    else:
        raise ValueError("Invalid user ID format")

    return {
        "title": title,
        "source": source,
        "destination": destination,
        "numberOfDays": int(numberOfDays),
        "budget": int(budget),
        "days": days,
        "backpackItems": backpack_items,
        "userid": user_object_id,
        "image":image_url
    }



@app.route("/generate", methods=["POST"])
def generate_and_store():
    data = request.get_json()
    required = ["mood", "current_location", "days", "budget", "destination", "user"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    user_data = data["user"]
    if isinstance(user_data, str):
        user_data = json.loads(user_data)

    title = f"{data['destination'].title()} Exploration: A {data['days']}-Day Journey"
    raw_text = generate_itinerary(data["destination"], data["days"], data["budget"], data["current_location"])

    if raw_text.startswith("Error:"):
        return jsonify({"error": raw_text}), 500

    parsed = parse_itinerary(
        raw_text,
        title,
        data["current_location"],
        data["destination"],
        data["days"],
        data["budget"],
        user_data
    )

    inserted = collection.insert_one(parsed)
    parsed["_id"] = str(inserted.inserted_id)
    parsed["userid"] = str(parsed["userid"])

    return jsonify(parsed), 200


@app.route("/itineraries", methods=["GET"])
def get_user_itineraries():
    try:
        user_id = request.headers.get("id")
        if not user_id:
            return jsonify({"error": "Missing ID in headers"}), 400

        cursor = collection.find({"userid": ObjectId(user_id)})
        results = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["userid"] = str(doc["userid"])
            results.append(doc)

        if not results:
            return jsonify({"error": "No itineraries found for this user"}), 404

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True, port=5000)
