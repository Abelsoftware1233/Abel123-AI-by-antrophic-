const log = document.getElementById("log");
const form = document.getElementById("cmdForm");
const input = document.getElementById("cmdInput");
const sendBtn = document.getElementById("sendBtn");
const core = document.getElementById("core");
const statusText = document.getElementById("statusText");
const clearBtn = document.getElementById("clearBtn");

// Volledige conversatiegeschiedenis, wordt elke keer meegestuurd naar de backend
let history = [];

function timestamp() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

function addLine({ tag, tagClass, text, lineClass }) {
  const line = document.createElement("div");
  line.className = `log-line ${lineClass}`;

  const ts = document.createElement("span");
  ts.className = "ts";
  ts.textContent = timestamp();

  const tagEl = document.createElement("span");
  tagEl.className = `tag ${tagClass}`;
  tagEl.textContent = tag;

  const msg = document.createElement("span");
  msg.className = "msg";
  msg.textContent = text;

  line.append(ts, tagEl, msg);
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  return msg;
}

function setThinking(isThinking) {
  core.classList.toggle("thinking", isThinking);
  sendBtn.disabled = isThinking;
  input.disabled = isThinking;
}

function setStatus(text, ok = true) {
  statusText.textContent = text;
  statusText.className = ok ? "ok" : "err";
}

async function sendMessage(text) {
  history.push({ role: "user", content: text });
  addLine({ tag: "YOU", tagClass: "user", text, lineClass: "user" });

  setThinking(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    const data = await res.json();

    if (!res.ok) {
      addLine({
        tag: "ERR",
        tagClass: "err",
        text: data.error || "Onbekende fout opgetreden.",
        lineClass: "error",
      });
      setStatus("fout", false);
      return;
    }

    setStatus("verbonden", true);
    history.push({ role: "assistant", content: data.reply });
    const msgEl = addLine({ tag: "AI", tagClass: "ai", text: "", lineClass: "ai" });
    typeOut(msgEl, data.reply);

  } catch (err) {
    addLine({
      tag: "ERR",
      tagClass: "err",
      text: "Kan geen verbinding maken met de server.",
      lineClass: "error",
    });
    setStatus("offline", false);
  } finally {
    setThinking(false);
  }
}

// Lichte typewriter-animatie voor AI-antwoorden
function typeOut(el, text) {
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  el.appendChild(cursor);

  let i = 0;
  const speed = text.length > 400 ? 4 : 12; // sneller bij lange antwoorden
  const interval = setInterval(() => {
    el.insertBefore(document.createTextNode(text[i]), cursor);
    i++;
    log.scrollTop = log.scrollHeight;
    if (i >= text.length) {
      clearInterval(interval);
      cursor.remove();
    }
  }, speed);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  sendMessage(text);
});

clearBtn.addEventListener("click", () => {
  history = [];
  log.innerHTML = "";
  addLine({
    tag: "SYS",
    tagClass: "sys",
    text: "Gesprek gewist. Nieuwe sessie gestart.",
    lineClass: "system",
  });
});
