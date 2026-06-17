
```markdown
# 🚀 Abel123 AI — Volledige AI-Suite

![Version](https://img.shields.io/badge/versie-2.0-cyan)
![Status](https://img.shields.io/badge/status-actief-brightgreen)
![License](https://img.shields.io/badge/licentie-MIT-blue)

Een geavanceerde, alles-in-één AI-assistent met **chat**, **beeldgeneratie** en **gezichtsherkenning**. Gebouwd met een prachtige retro-futuristische terminalstijl, volledig mobielvriendelijk.

---

## ✨ Functionaliteiten

| Functie | Beschrijving | API |
|---------|--------------|-----|
| 💬 **Chat** | Intelligent tekstgesprek met Claude | Anthropic |
| 🎨 **Beeldgeneratie** | Maak afbeeldingen op basis van tekst | Google Gemini/Imagen |
| 👤 **Gezichtsherkenning** | Analyseer gezichten op leeftijd, emotie, geslacht | OpenAI Vision |
| 📱 **Mobielvriendelijk** | Volledig responsive design | - |
| 🎯 **Upload functie** | Upload foto's voor analyse | - |
| 🖥️ **Terminal UI** | Retro-futuristische interface | - |

---

## 📋 Vereisten

- Python 3.8 of hoger
- API-keys van:
  - [Anthropic](https://console.anthropic.com/settings/keys) (Claude)
  - [Google AI Studio](https://aistudio.google.com/apikey) (Gemini/Imagen)
  - [OpenAI](https://platform.openai.com/api-keys) (Vision)

---

## 🛠️ Installatie

### 1. Clone of download de repository
```bash
git clone https://github.com/are1233/abel123-ai.git
cd abel123-ai
```

2. Installeer vereisten

```bash
pip install -r requirements.txt
```

3. Configureer API-keys

Kopieer het voorbeeldbestand en vul je keys in:

```bash
cp .env.example .env
```

Open .env en voeg je keys toe:

```env
ANTHROPIC_API_KEY=sk-ant-api-...
GOOGLE_API_KEY=AIza...
OPENAI_API_KEY=sk-...
```

4. Start de server

```bash
python app.py
```

5. Open in browser

Ga naar: http://localhost:5000

---

📂 Bestandsstructuur

```
abel123-ai/
├── app.py                 # Main server met alle API-integraties
├── requirements.txt       # Python dependencies
├── .env.example           # Voorbeeld configuratie
├── index.html            # Hoofdinterface
├── style.css             # Mobielvriendelijk design
├── script.js             # Alle client-side logica
├── README.md             # Deze documentatie
└── uploads/              # Tijdelijke uploads (automatisch aangemaakt)
```

---

🎨 Interface

💬 Chat Tab

· Stel vragen aan Claude
· Typewriter-effect voor antwoorden
· Gespreksgeschiedenis blijft behouden
· Reset-knop om gesprek te wissen

🎨 Beeld Tab

· Beschrijf wat je wilt zien
· Genereer afbeeldingen met Gemini/Imagen
· Afbeelding wordt weergegeven in de preview

👤 Gezicht Tab

· Upload een gezichtsfoto
· Klik op "Analyseer"
· Ontvang analyse over:
  · Leeftijdsschatting
  · Emotie
  · Geslacht
  · Opvallende kenmerken

---

🔧 Aanpassingen

Persoonlijkheid aanpassen

Open app.py en wijzig SYSTEM_PROMPT:

```python
SYSTEM_PROMPT = (
    "Je bent Abel123 AI, een persoonlijke assistent..."
)
```

Model wijzigen

In app.py bij de chat-functie:

```python
model="claude-sonnet-4-6"  # Verander naar gewenst model
```

Styling aanpassen

In style.css bovenaan:

```css
:root {
  --cyan: #4de8e0;     /* Primaire kleur */
  --violet: #9d7cff;   /* Secundaire kleur */
  --bg: #060b14;       /* Achtergrond */
}
```

---

🚀 Deploy naar Productie

Optie 1: Render.com (gratis)

1. Push code naar GitHub
2. Ga naar Render.com
3. Kies New Web Service → verbind repo
4. Instellingen:
   · Build Command: pip install -r requirements.txt
   · Start Command: gunicorn app:app
5. Voeg environment variables toe:
   · ANTHROPIC_API_KEY
   · GOOGLE_API_KEY
   · OPENAI_API_KEY
6. Klik op Deploy

Optie 2: Railway.app (gratis)

1. Push code naar GitHub
2. Ga naar Railway.app
3. Kies Deploy from GitHub
4. Voeg environment variables toe
5. Klaar! Je krijgt een live URL

Optie 3: Hugging Face Spaces

1. Maak een Space aan met Docker
2. Upload alle bestanden
3. Voeg secrets toe voor API-keys
4. Deploy automatisch

---

📱 Mobiel Gebruik

Feature Ondersteuning
Responsive design ✅ Volledig
Touch knoppen ✅ Groot en toegankelijk
Camera upload ✅ Via file input
Scrollen ✅ Vloeiend
Dark mode ✅ Standaard

---

🔒 Veiligheid

· ✅ API-keys via environment variables (niet in code)
· ✅ Geen keys in client-side JavaScript
· ✅ CORS correct geconfigureerd
· ✅ Input validatie op server
· ✅ Rate limiting mogelijk (optioneel)

---

❓ Veelgestelde Vragen

Q: Werkt dit op GitHub Pages?
A: Nee, GitHub Pages is statisch. Je moet de server draaien op een platform zoals Render of Railway.

Q: Kan ik meerdere afbeeldingen genereren?
A: Ja, pas number_of_images=1 aan in app.py.

Q: Welke afbeeldingsformaten ondersteunt gezichtsherkenning?
A: JPG, PNG, WEBP, GIF (statisch).

Q: Hoe snel is de response?
A: Chat: 1-3 sec, Beeld: 5-10 sec, Gezicht: 2-4 sec.

---

🐛 Probleemoplossing

Fout: "Geen API-key gevonden"

· Controleer of .env bestaat
· Controleer of de variabelen correct zijn gespeld
· Herstart de server na wijzigingen

Fout: "CORS" problemen

· Zorg dat flask-cors is geïnstalleerd
· Controleer of CORS(app) in app.py staat

Fout: "Geen verbinding"

· Controleer of de server draait
· Controleer de poort (standaard 5000)
· Controleer firewall-instellingen

Beeldgeneratie werkt niet

· Controleer Google API-key
· Zorg dat Imagen beschikbaar is in jouw regio
· Controleer of het model correct is: imagen-3.0-generate-001

---

📊 API-limieten

API Gratis limiet Betaald
Anthropic Claude 5 requests/min €0.003/1K tokens
Google Gemini 60 requests/min €0.001/afbeelding
OpenAI Vision 20 requests/min €0.002/afbeelding

---

🤝 Bijdragen

Pull requests zijn welkom! Voor grote wijzigingen, open eerst een issue om te bespreken wat je wilt veranderen.

1. Fork de repository
2. Maak een feature branch (git checkout -b feature/AmazingFeature)
3. Commit je wijzigingen (git commit -m 'Add some AmazingFeature')
4. Push naar de branch (git push origin feature/AmazingFeature)
5. Open een Pull Request

---

📜 Licentie

Distributed under the MIT License. Zie LICENSE voor meer informatie.

---

📞 Contact

· GitHub: are1233
· Website: are1233.github.io
· Issues: GitHub Issues

---

🙏 Credits

· Anthropic — Claude API voor chat
· Google — Gemini/Imagen voor beeldgeneratie
· OpenAI — Vision API voor gezichtsherkenning
· Fonts: Orbitron, Inter, JetBrains Mono

---

📸 Screenshots

Voeg hier screenshots toe van de interface

Chat Beeld Gezicht
screenshots/chat.png screenshots/image.png screenshots/face.png

---

🎯 Roadmap

· Chat functionaliteit
· Beeldgeneratie
· Gezichtsherkenning
· Mobielvriendelijk
· Voice input
· Meer AI-modellen
· Export gesprekken
· Meertalige ondersteuning

---

Gemaakt met ❤️ door Abel | © 2026 Alle rechten voorbehouden

```

---

## 📝 Hoe naar Word te kopiëren

### Methode 1: Direct kopiëren
1. **Kopieer** alle bovenstaande tekst (inclusief de markdown-codeblokken)
2. Open **Microsoft Word**
3. **Plak** de tekst (Ctrl+V)
4. Word behoudt de opmaak grotendeels

### Methode 2: Als .docx bestand
1. Kopieer de tekst naar een teksteditor (Notepad)
2. Sla op als `README.md`
3. Open met Word → Word herkent markdown en formatteert automatisch

### Methode 3: Online converter
1. Ga naar [Markdown to Word converter](https://www.markdowntoword.com)
2. Plak de markdown
3. Download als `.docx`

---

## 🎨 Extra: Word-template met logo

Wil je een professioneel Word-document? Voeg deze kop toe bovenaan:

```html
<!-- Plak bovenaan in Word -->
<h1 align="center">
  <img src="logo.png" width="100"><br>
  Abel123 AI — Volledige Suite
</h1>
```

---

Auteursrechten: Abelsoftware123 
copyright: Abelsoftware123 