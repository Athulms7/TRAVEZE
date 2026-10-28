from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import jwt
import re
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os


load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")


groq = Groq(api_key=groq_api_key)

client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/tripwish"))
db = client.get_default_database()
collection = db["itineraries"]


app = Flask(__name__)
CORS(app)


def get_authenticated_user_id():
    authorization = request.headers.get("Authorization", "")
    token = re.sub(r"^Bearer\s+", "", authorization, flags=re.IGNORECASE).strip()
    jwt_secret = os.getenv("JWT_SECRET")
    if not jwt_secret:
        app.logger.error("JWT_SECRET is not configured.")
        return None, (jsonify({"error": "Authentication is not configured."}), 500)
    if not token:
        return None, (jsonify({"error": "Authentication is required."}), 401)

    try:
        decoded_token = jwt.decode(token, jwt_secret, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return None, (jsonify({"error": "Authentication token is invalid or expired."}), 401)

    user_id = decoded_token.get("id")
    if not isinstance(user_id, str) or not ObjectId.is_valid(user_id):
        return None, (jsonify({"error": "Authentication token does not contain a valid user ID."}), 401)
    return user_id, None


def generate_itinerary(destination, days, budget, current_location, mood):
    prompt = (
        f"Create a {days}-day itinerary for a {mood} trip to {destination} from {current_location} "
        f"with a total budget of {budget} INR. "
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
        "Use exactly the requested number of days. Each activity must have a time in HH:MM AM/PM format "
        "followed by ' - ' and the activity. Do not use Markdown formatting.\n"
        "At the end, add:\nBackpack Items: item1, item2, item3"
    )

    response = groq.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": "You are a helpful travel assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    itinerary = response.choices[0].message.content
    if not itinerary or not itinerary.strip():
        raise ValueError("The AI provider returned an empty itinerary.")
    return itinerary

def generate_destination_image_url(destination):
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"

def parse_itinerary(text, title, source, destination, number_of_days, budget, user_id):
    days = []
    backpack_items = []
    image_url = generate_destination_image_url(destination)
    current_day = None
    activities = []

    for raw_line in text.splitlines():
        line = re.sub(r"^\s*(?:[-*#>]\s*)+", "", raw_line).strip().strip("*_")
        day_match = re.match(r"^Day\s+(\d+)\b", line, re.IGNORECASE)
        backpack_match = re.match(r"^Backpack Items\s*:\s*(.*)$", line, re.IGNORECASE)
        activity_match = re.match(
            r"^(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[-–—:]\s*(.+)$",
            line,
            re.IGNORECASE,
        )

        if day_match:
            if current_day:
                days.append({"day": current_day, "activities": activities})
            current_day = int(day_match.group(1))
            activities = []
        elif backpack_match:
            backpack_items = [item.strip() for item in backpack_match.group(1).split(",") if item.strip()]
        elif activity_match and current_day:
            activities.append({
                "time": activity_match.group(1).upper(),
                "activity": activity_match.group(2).strip(),
            })

    if current_day:
        days.append({"day": current_day, "activities": activities})

    expected_days = int(number_of_days)
    if [day["day"] for day in days] != list(range(1, expected_days + 1)):
        raise ValueError("The generated itinerary does not contain every requested day.")
    if any(not day["activities"] for day in days):
        raise ValueError("The generated itinerary contains a day with no activities.")

    user_id_value = user_id.get("id") if isinstance(user_id, dict) else user_id
    if not isinstance(user_id_value, str) or not ObjectId.is_valid(user_id_value):
        raise ValueError("Invalid user ID.")
    user_object_id = ObjectId(user_id_value)

    return {
        "title": title,
        "source": source,
        "destination": destination,
        "numberOfDays": expected_days,
        "budget": int(budget),
        "days": days,
        "backpackItems": backpack_items,
        "userid": user_object_id,
        "image": image_url
    }



@app.route("/generate", methods=["POST"])
def generate_and_store():
    user_id, auth_error = get_authenticated_user_id()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400

    required = ["mood", "current_location", "days", "budget", "destination"]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    text_fields = ["mood", "current_location", "destination"]
    if any(not isinstance(data[field], str) or not data[field].strip() for field in text_fields):
        return jsonify({"error": "Mood, current location, and destination must be text."}), 400

    try:
        days = int(data["days"])
        budget = int(data["budget"])
    except (TypeError, ValueError):
        return jsonify({"error": "Days and budget must be positive whole numbers."}), 400
    if days <= 0 or budget <= 0:
        return jsonify({"error": "Days and budget must be positive whole numbers."}), 400

    title = f"{data['destination'].title()} Exploration: A {days}-Day Journey"
    try:
        raw_text = generate_itinerary(
            data["destination"],
            days,
            budget,
            data["current_location"],
            data["mood"],
        )
    except Exception:
        app.logger.exception("Itinerary generation failed.")
        return jsonify({"error": "Itinerary generation failed. Please try again."}), 502

    try:
        parsed = parse_itinerary(
            raw_text,
            title,
            data["current_location"],
            data["destination"],
            days,
            budget,
            user_id,
        )
    except (TypeError, ValueError) as error:
        app.logger.warning("Generated itinerary could not be parsed: %s", error)
        return jsonify({"error": "The generated itinerary was incomplete. Please try again."}), 502

    try:
        inserted = collection.insert_one(parsed)
    except Exception:
        app.logger.exception("Generated itinerary could not be saved.")
        return jsonify({"error": "The itinerary could not be saved. Please try again."}), 500

    parsed["_id"] = str(inserted.inserted_id)
    parsed["userid"] = str(parsed["userid"])
    return jsonify(parsed), 200


@app.route("/itineraries", methods=["GET"])
def get_user_itineraries():
    user_id, auth_error = get_authenticated_user_id()
    if auth_error:
        return auth_error

    try:
        results = list(collection.find({"userid": ObjectId(user_id)}))
        for doc in results:
            doc["_id"] = str(doc["_id"])
            doc["userid"] = str(doc["userid"])
        return jsonify(results), 200
    except Exception:
        app.logger.exception("Failed to load itineraries.")
        return jsonify({"error": "Unable to load itineraries."}), 500



if __name__ == "__main__":
    app.run(debug=True, port=5000)
