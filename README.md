# NEXUS — eigen AI-chatapp op de Claude-API

Een chat-terminal in eigen stijl die jouw berichten doorstuurt naar Claude via de Anthropic API.

## Installatie

1. Zorg dat Python 3.9+ geïnstalleerd is.
2. Open een terminal in deze map en installeer de dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Hernoem `.env.example` naar `.env` en vul je eigen API-key in:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
   Een key maak je aan op https://console.anthropic.com/settings/keys (let op: gebruik van de API kost geld per gebruik, los van een Claude.ai-abonnement).
4. Start de server:
   ```
   python app.py
   ```
5. Open in je browser: http://127.0.0.1:5000

## Aanpassen

- **Persoonlijkheid / naam van je AI** → pas `SYSTEM_PROMPT` aan in `app.py`.
- **Model** → zet `ANTHROPIC_MODEL` in `.env`, bijvoorbeeld `claude-opus-4-7` voor meer redeneerkracht, of `claude-haiku-4-5-20251001` voor snelheid/kosten.
- **Uiterlijk** → kleuren en lettertypes staan als variabelen boven in `static/style.css`.

## Structuur

```
nexus-ai/
├── app.py              ← Flask-backend, praat met de Anthropic API
├── requirements.txt
├── .env.example         ← hernoem naar .env + vul key in
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## Let op

De gesprekgeschiedenis wordt alleen in de browser onthouden (verdwijnt bij verversen) en niet ergens opgeslagen — voor een opslagoplossing kun je een database zoals SQLite toevoegen.
