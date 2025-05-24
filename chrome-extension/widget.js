// Dragging support
const dragHandle = document.getElementById('drag-handle');
let isDragging = false, initialX, initialY;
dragHandle.addEventListener('mousedown', function(e) {
  isDragging = true;
  initialX = e.clientX;
  initialY = e.clientY;
  window.parent.postMessage({ type: 'DRAG_START', clientX: e.clientX, clientY: e.clientY }, '*');
});
document.addEventListener('mousemove', function(e) {
  if (isDragging) {
    window.parent.postMessage({ type: 'DRAG_MOVE', clientX: e.clientX, clientY: e.clientY }, '*');
  }
});
document.addEventListener('mouseup', function() {
  isDragging = false;
  window.parent.postMessage({ type: 'DRAG_END' }, '*');
});
// Minimize/settings
document.getElementById('minimize-btn').onclick = () => window.parent.postMessage({ type: 'MINIMIZE_WIDGET' }, '*');
document.getElementById('settings-btn').onclick = () => alert('Settings coming soon!');

// Translation and TTS logic
async function translateToAkan(text) {
  try {
    const response = await fetch("https://ghana-nlp-tts.onrender.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, target_lang: "en-tw" })
    });
    if (!response.ok) throw new Error("Translation API error");
    const data = await response.json();
    return data.translation || text;
  } catch (e) {
    console.error("Translation failed:", e);
    return text;
  }
}

async function getTwiAudioUrl(text) {
  try {
    // Debug log for API request
    const requestBody = { 
      text: text, 
      language: "tw", 
      speaker_id: "twi_speaker_5" 
    };
    console.log("TTS API Request:", requestBody);
    
    const response = await fetch("https://ghana-nlp-tts.onrender.com/tts", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "audio/mp3"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TTS API error ${response.status}:`, errorText);
      throw new Error(`TTS API error: ${response.status}: ${errorText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("TTS failed:", e);
    return null;
  }
}

let lastTranslation = '';
let lastEnglish = '';
const form = document.getElementById('kb-form');
const input = document.getElementById('english-input');
const status = document.getElementById('status-message');
const playAudioBtn = document.getElementById('play-audio-btn');
const shareMeetingBtn = document.getElementById('share-meeting-btn');
const audioStatus = document.getElementById('audio-status');
const twiAudio = document.getElementById('twi-audio');
playAudioBtn.disabled = true;
shareMeetingBtn.disabled = true;

form.onsubmit = async function(e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  lastEnglish = text;
  status.textContent = 'Translating...';
  playAudioBtn.disabled = true;
  shareMeetingBtn.disabled = true;
  try {
    const akan = await translateToAkan(text);
    lastTranslation = akan;
    status.textContent = akan;
    if (akan && akan !== text) {
      playAudioBtn.disabled = false;
      shareMeetingBtn.disabled = false;
    } else {
      playAudioBtn.disabled = true;
      shareMeetingBtn.disabled = true;
    }
  } catch (err) {
    status.textContent = 'Translation failed. Check your connection.';
    playAudioBtn.disabled = true;
    shareMeetingBtn.disabled = true;
    console.error('Translation error:', err);
  }
};

playAudioBtn.onclick = async function() {
  if (!lastTranslation || lastTranslation === lastEnglish) {
    audioStatus.textContent = 'Translate first!';
    return;
  }
  audioStatus.textContent = 'Generating audio...';
  playAudioBtn.disabled = true;
  try {
    const audioUrl = await getTwiAudioUrl(lastTranslation);
    if (!audioUrl) throw new Error('No audio');
    twiAudio.src = audioUrl;
    twiAudio.play();
    audioStatus.textContent = 'Playing...';
    twiAudio.onended = () => {
      audioStatus.textContent = '';
      playAudioBtn.disabled = false;
    };
  } catch (e) {
    audioStatus.textContent = 'Audio error. See console.';
    playAudioBtn.disabled = false;
    console.error('TTS error:', e);
  }
};

shareMeetingBtn.onclick = async function() {
  if (!lastTranslation || lastTranslation === lastEnglish) {
    audioStatus.textContent = 'Translate first!';
    return;
  }
  audioStatus.textContent = 'Sharing audio to meeting...';
  shareMeetingBtn.disabled = true;
  try {
    const audioUrl = await getTwiAudioUrl(lastTranslation);
    if (!audioUrl) throw new Error('No audio');
    window.parent.postMessage({ type: 'SHARE_AUDIO_TO_MEETING', audioUrl }, '*');
    audioStatus.textContent = 'Shared in meeting!';
  } catch (e) {
    audioStatus.textContent = 'Share failed. See console.';
    console.error('Share error:', e);
  } finally {
    shareMeetingBtn.disabled = false;
  }
};

document.querySelector('.kb-lang-refresh').onclick = () => {
  input.value = '';
  status.textContent = 'Ready to translate';
  playAudioBtn.disabled = true;
  shareMeetingBtn.disabled = true;
  lastTranslation = '';
  lastEnglish = '';
  input.focus();
};