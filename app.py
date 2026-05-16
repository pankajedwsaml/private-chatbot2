from flask import Flask, render_template, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.json.get("message")

    response = client.chat.completions.create(
      model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """
                You are a private assistant.
                Talk naturally like a real chatbot.
                Keep answers short and useful.
                Be engaging.
                """
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    bot_reply = response.choices[0].message.content

    return jsonify({
        "reply": bot_reply
    })


if __name__ == "__main__":
    app.run(debug=True)