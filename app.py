import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import anthropic

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("ANTHROPIC_API_KEY")
MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6")

client = anthropic.Anthropic(api_key=API_KEY) if API_KEY else None

# Pas dit aan om de persoonlijkheid van jouw AI te bepalen
SYSTEM_PROMPT = (
    "Je bent NEXUS, een persoonlijke AI-assistent gebouwd door Abel. "
    "Je antwoordt helder, direct en behulpzaam, in dezelfde taal als de gebruiker. "
    "Je hebt een rustige, zelfverzekerde toon zonder overbodige uitleg."
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    if client is None:
        return jsonify({
            "error": "Geen API-key gevonden. Zet ANTHROPIC_API_KEY in je .env bestand."
        }), 500

    data = request.get_json(force=True)
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"error": "Geen berichten ontvangen."}), 400

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        reply_text = "".join(
            block.text for block in response.content if block.type == "text"
        )
        return jsonify({"reply": reply_text})

    except anthropic.AuthenticationError:
        return jsonify({"error": "Ongeldige API-key."}), 401
    except anthropic.APIError as e:
        return jsonify({"error": f"API-fout: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Onverwachte fout: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
