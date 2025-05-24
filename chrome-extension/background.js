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
    else if (message.type === 'SHARE_PRE_AUDIO_TO_MEETING') {    // Play pre-generated audio file in meeting
    const audioUrl = chrome.runtime.getURL('synthesize_text.wav');
    
    // Try multiple methods to ensure audio is heard in meetings
    console.log("Attempting to share audio in meeting using multiple methods");
    
    // Method 1: Use the Chrome Audio API and tabCapture
    playAudioInMeeting(audioUrl, meetingTabId)
      .then(() => {
        console.log("Audio successfully played through tabCapture");
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error("tabCapture method failed:", error);
        
        // Method 2: Try sending audio directly to content script
        chrome.tabs.sendMessage(meetingTabId, {
          type: 'INJECT_AUDIO',
          audioUrl: audioUrl
        }, response => {
          if (chrome.runtime.lastError) {
            console.error("Direct audio injection failed:", chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true });
          }
        });
      });
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
  
  console.log('AUDIO SHARING: Attempting to share audio in meeting', { tabId, audioUrl });
  
  // Create a tab capture stream to inject audio
  try {
    // Create audio context if it doesn't exist
    if (!audioContext) {
      audioContext = new AudioContext();
      mediaStreamDestination = audioContext.createMediaStreamDestination();
    }
      // First attempt: Load audio data directly into an AudioBuffer for higher quality
    try {
      // Fetch the audio file data
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      console.log('AUDIO SHARING: Successfully decoded audio data', { duration: audioBuffer.duration });
      
      // Create a buffer source node for high-quality playback
      const bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = audioBuffer;
      
      // Create a gain node to boost volume
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 2.0; // Double the volume for better transmission
      
      // Create a compressor to prevent distortion
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      
      // Connect the nodes for local playback
      bufferSource.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(audioContext.destination);
      
      // Try tab capture to inject into meeting's audio stream
      try {
        const stream = await chrome.tabCapture.capture({
          audio: true,
          video: false,
          audioConstraints: {
            mandatory: {
              chromeMediaSource: 'tab'
            }
          }
        });
        
        if (stream) {
          console.log('AUDIO SHARING: Tab capture successful, attempting stream injection');
          
          // Connect to the media stream destination for tab capture
          bufferSource.connect(mediaStreamDestination);
          
          // Notify content script about available audio stream
          chrome.tabs.sendMessage(tabId, {
            type: 'INJECT_AUDIO',
            streamId: mediaStreamDestination.stream.id
          });
        }
      } catch (tabCaptureError) {
        console.warn('AUDIO SHARING: Tab capture failed', tabCaptureError);
      }
      
      // Also send direct URL to content script for redundant playback
      chrome.tabs.sendMessage(tabId, {
        type: 'INJECT_AUDIO',
        audioUrl: audioUrl,
        mode: 'high_volume'
      });
      
      // Start audio playback
      bufferSource.start(0);
      console.log('AUDIO SHARING: Audio playback started with AudioBuffer API');
      
      // Return a promise that resolves when the audio is done playing
      return new Promise((resolve) => {
        bufferSource.onended = () => {
          console.log('AUDIO SHARING: Audio playback ended');
          resolve();
        };
        
        // Fallback timeout in case onended doesn't fire
        setTimeout(resolve, audioBuffer.duration * 1000 + 500);
      });
    } 
    catch (bufferError) {      console.error('AUDIO SHARING: Buffer approach failed', bufferError);
      
      // Fall back to traditional Audio element approach
      try {
        const audio = new Audio(audioUrl);
        audio.volume = 1.0; // Maximum volume
        
        // Send the audio URL to content script for direct playback
        chrome.tabs.sendMessage(tabId, {
          type: 'INJECT_AUDIO',
          audioUrl: audioUrl
        });
        
        // Play the audio locally as well
        await audio.play();
        console.log('AUDIO SHARING: Fallback audio playback started');
        
        // Return a promise that resolves when the audio is done playing
        return new Promise((resolve) => {
          audio.onended = resolve;
        });
      } catch (fallbackError) {
        console.error('AUDIO SHARING: Fallback approach also failed', fallbackError);
        throw fallbackError;
      }
    }
  } 
  catch (error) {
    console.error('Error playing audio in meeting:', error);
    throw error;
  }
}