// Background script for meeting integration
chrome.runtime.onInstalled.addListener(() => {
  console.log('KasaBridge Translator extension installed');
});

// Store for audio context and tracks
let audioContext = null;
let mediaStreamDestination = null;
let meetingTabId = null;

// Listen for messages from content script or widget
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'MEETING_JOINED') {
    // Keep track of which tab has the meeting
    meetingTabId = sender.tab.id;
    sendResponse({ success: true });
    return true;
  }
  
  else if (message.type === 'TRANSLATE_TEXT') {
    // Forward to the NextJS API for translation
    fetch('https://apparent-splendid-locust.ngrok-free.app/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.text, targetLanguage: 'twi' })
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ success: true, translation: data.translation });
    })
    .catch(error => {
      sendResponse({ success: false, error: error.toString() });
    });
    return true; // Required for async sendResponse
  }
  
  else if (message.type === 'SPEAK_IN_MEETING') {
    // Call NextJS TTS API and then inject the audio into meeting
    fetch('https://apparent-splendid-locust.ngrok-free.app/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.text, language: 'twi' })
    })
    .then(response => response.blob())
    .then(blob => {
      const audioUrl = URL.createObjectURL(blob);
      playAudioInMeeting(audioUrl, meetingTabId)
        .then(() => {
          sendResponse({ success: true });
        })
        .catch(error => {
          sendResponse({ success: false, error: error.toString() });
        });
    })
    .catch(error => {
      sendResponse({ success: false, error: error.toString() });
    });
    return true;
  }
});

// Function to play audio in the meeting
async function playAudioInMeeting(audioUrl, tabId) {
  // First, ensure we have tab capture permission
  if (!tabId) {
    throw new Error('No active meeting tab found');
  }
  
  // Create a tab capture stream to inject audio
  try {
    // Capture tab audio to synchronize with it
    const stream = await chrome.tabCapture.capture({
      audio: true,
      video: false,
      audioConstraints: {
        mandatory: {
          chromeMediaSource: 'tab'
        }
      }
    });
    
    if (!stream) {
      throw new Error('Failed to capture tab audio');
    }
    
    // Create audio context if it doesn't exist
    if (!audioContext) {
      audioContext = new AudioContext();
      mediaStreamDestination = audioContext.createMediaStreamDestination();
    }
    
    // Load the translated audio
    const audio = new Audio(audioUrl);
    const source = audioContext.createMediaElementSource(audio);
    source.connect(mediaStreamDestination);
    source.connect(audioContext.destination); // Also play locally
    
    // Send the audio to the meeting tab
    chrome.tabs.sendMessage(tabId, {
      type: 'INJECT_AUDIO',
      streamId: mediaStreamDestination.stream.id
    });
    
    // Play the audio
    audio.play();
    
    // Return a promise that resolves when the audio is done playing
    return new Promise((resolve) => {
      audio.onended = resolve;
    });
  } 
  catch (error) {
    console.error('Error playing audio in meeting:', error);
    throw error;
  }
}