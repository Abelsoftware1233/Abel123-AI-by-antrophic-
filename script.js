// ============================================
// ABEL123 AI — Volledige Functionaliteit
// ============================================

const log = document.getElementById("log");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const core = document.getElementById("core");
const statusText = document.getElementById("statusText");
const clearBtn = document.getElementById("clearBtn");

// Tabs
const tabs = document.querySelectorAll('.tab');
const tabContents = {
  chat: document.getElementById('chatTab'),
  image: document.getElementById('imageTab'),
  face: document.getElementById('faceTab')
};

// Image
const imageForm = document.getElementById('imageForm');
const imagePrompt = document.getElementById('imagePrompt');
const generateBtn = document.getElementById('generateBtn');
const imagePreview = document.getElementById('imagePreview');

// Face
const faceUpload = document.getElementById('faceUpload');
const uploadBtn = document.getElementById('uploadBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const facePreview = document.getElementById('facePreview');
const analysisResult = document.getElementById('analysisResult');

// State
let chatHistory = [];
let uploadedImage = null;

// ============================================
// 1. TAB NAVIGATIE
// ============================================
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const tabName = tab.dataset.tab;
    Object.keys(tabContents).forEach(key => {
      tabContents[key].classList.toggle('active', key === tabName);
    });
  });
});

// ============================================
// 2. CHAT FUNCTIE
// ============================================
function timestamp() {
  return new Date().toTimeString().slice(0, 8);
}

function addChatMessage(tag, tagClass, text, lineClass = '') {
  const div = document.createElement('div');
  div.className = `message ${lineClass}`;
  
  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = timestamp();
  
  const badge = document.createElement('span');
  badge.className = `badge ${tagClass}`;
  badge.textContent = tag;
  
  const content = document.createElement('span');
  content.className = 'content';
  
  if (typeof text === 'string') {
    content.textContent = text;
  } else {
    content.appendChild(text);
  }
  
  div.append(time, badge, content);
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function setThinking(isThinking) {
  core.classList.toggle('thinking', isThinking);
  sendBtn.disabled = isThinking;
  chatInput.disabled = isThinking;
}

async function sendChatMessage(text) {
  chatHistory.push({ role: "user", content: text });
  addChatMessage('YOU', 'user', text, 'user');
  
  setThinking(true);
  statusText.textContent = '● Denken...';
  statusText.className = 'status';
  
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      addChatMessage('ERR', 'error', data.error || 'Fout', 'error');
      statusText.textContent = '● Fout';
      statusText.className = 'status error';
      return;
    }
    
    chatHistory.push({ role: "assistant", content: data.reply });
    addChatMessage('ABEL123', 'ai', data.reply, 'ai');
    statusText.textContent = '● Verbonden';
    statusText.className = 'status';
    
  } catch (err) {
    addChatMessage('ERR', 'error', 'Kan geen verbinding maken.', 'error');
    statusText.textContent = '● Offline';
    statusText.className = 'status error';
  } finally {
    setThinking(false);
    chatInput.focus();
  }
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  sendChatMessage(text);
});

// ============================================
// 3. BEELDGENERATIE (Gemini)
// ============================================
imageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = imagePrompt.value.trim();
  if (!prompt) return;
  
  generateBtn.disabled = true;
  generateBtn.textContent = '⏳ Genereert...';
  imagePreview.innerHTML = '<span class="placeholder">⏳ Afbeelding wordt gemaakt...</span>';
  
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      imagePreview.innerHTML = `<span class="placeholder">❌ ${data.error}</span>`;
      return;
    }
    
    imagePreview.innerHTML = `<img src="${data.image}" alt="${prompt}">`;
    
  } catch (err) {
    imagePreview.innerHTML = '<span class="placeholder">❌ Fout bij genereren</span>';
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = '✨ Genereer';
    imagePrompt.value = '';
  }
});

// ============================================
// 4. GEZICHTSHERKENNING (OpenAI Vision)
// ============================================
uploadBtn.addEventListener('click', () => {
  faceUpload.click();
});

faceUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedImage = event.target.result;
    facePreview.innerHTML = `<img src="${uploadedImage}" alt="Uploaded face">`;
    analyzeBtn.disabled = false;
    analysisResult.textContent = '📸 Klik op "Analyseer" om te starten...';
  };
  reader.readAsDataURL(file);
});

analyzeBtn.addEventListener('click', async () => {
  if (!uploadedImage) return;
  
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = '⏳ Analyseren...';
  analysisResult.textContent = '🔍 Bezig met analyseren...';
  
  // Converteer dataURL naar blob
  const response = await fetch(uploadedImage);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append('image', blob, 'face.jpg');
  
  try {
    const res = await fetch('/api/analyze-face', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      analysisResult.textContent = `❌ ${data.error}`;
      return;
    }
    
    analysisResult.textContent = data.analysis;
    
  } catch (err) {
    analysisResult.textContent = '❌ Fout bij analyseren';
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = '🔍 Analyseer';
  }
});

// ============================================
// 5. CLEAR / RESET
// ============================================
clearBtn.addEventListener('click', () => {
  chatHistory = [];
  log.innerHTML = '';
  addChatMessage('SYS', 'sys', 'Gesprek gewist. Nieuwe sessie.', 'system');
});

// ============================================
// 6. INIT
// ============================================
console.log('🚀 Abel123 AI geladen!');