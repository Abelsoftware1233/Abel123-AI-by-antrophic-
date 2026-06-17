import os
import base64
import tempfile
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import anthropic
import google.generativeai as genai
from openai import OpenAI
from PIL import Image
import io

load_dotenv()

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

# --- API Keys ---
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# --- Clients ---
anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None
genai.configure(api_key=GOOGLE_API_KEY) if GOOGLE_API_KEY else None
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# --- Systeemprompt ---
SYSTEM_PROMPT = (
    "Je bent Abel123 AI, een geavanceerde AI-assistent gebouwd door Abel. "
    "Je antwoordt helder, direct en behulpzaam in dezelfde taal als de gebruiker. "
    "Je kunt tekst, afbeeldingen genereren en gezichten herkennen."
)

# ========================
# 1. CHAT (Anthropic)
# ========================
@app.route("/api/chat", methods=["POST"])
def chat():
    if not anthropic_client:
        return jsonify({"error": "Anthropic API-key ontbreekt"}), 500
    
    data = request.get_json()
    messages = data.get("messages", [])
    
    try:
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        reply = "".join(block.text for block in response.content if block.type == "text")
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========================
# 2. BEELDGENERATIE (Gemini/Imagen)
# ========================
@app.route("/api/generate-image", methods=["POST"])
def generate_image():
    if not GOOGLE_API_KEY:
        return jsonify({"error": "Google API-key ontbreekt"}), 500
    
    data = request.get_json()
    prompt = data.get("prompt", "")
    
    try:
        model = genai.GenerativeModel('imagen-3.0-generate-001')
        response = model.generate_images(
            prompt=prompt,
            number_of_images=1,
            safety_filter_level="block_only_high",
            person_generation="allow_adult"
        )
        
        # Converteer afbeelding naar base64
        image = response.images[0]
        img = Image.open(io.BytesIO(image._image_bytes))
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({"image": f"data:image/png;base64,{img_base64}"})
    except Exception as e:
        return jsonify({"error": f"Beeldgeneratie mislukt: {str(e)}"}), 500

# ========================
# 3. GEZICHTSHERKENNING (OpenAI Vision)
# ========================
@app.route("/api/analyze-face", methods=["POST"])
def analyze_face():
    if not OPENAI_API_KEY:
        return jsonify({"error": "OpenAI API-key ontbreekt"}), 500
    
    if 'image' not in request.files:
        return jsonify({"error": "Geen afbeelding geüpload"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Geen bestand geselecteerd"}), 400
    
    try:
        # Lees afbeelding en converteer naar base64
        img_bytes = file.read()
        img_base64 = base64.b64encode(img_bytes).decode()
        
        # Analyseer met OpenAI Vision
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyseer deze gezichtsafbeelding. Beschrijf: 1) Leeftijdsschatting 2) Emotie 3) Geslacht 4) Eventuele opvallende kenmerken. Wees beknopt."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{img_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        analysis = response.choices[0].message.content
        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": f"Analyse mislukt: {str(e)}"}), 500

# ========================
# 4. STATISCHE BESTANDEN
# ========================
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)

if __name__ == "__main__":
    app.run(debug=True, port=5000)