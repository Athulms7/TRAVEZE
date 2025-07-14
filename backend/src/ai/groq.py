from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
import openai # type: ignore
import os

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")

    try:
        response = openai.ChatCompletion.create(
            model="llama3-70b-8192",  # or mixtral-8x7b-32768, gemma-7b-it
            messages=[
                {"role": "system", "content": "You are a helpful travel assistant."},
                {"role": "user", "content": user_input}
            ]
        )
        return jsonify({
            "response": response.choices[0].message["content"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
