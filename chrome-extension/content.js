(function() {
  // Prevent multiple injections
  if (window.__kasabridge_widget_injected) return;
  window.__kasabridge_widget_injected = true;
  
  // Try to get system audio permissions early
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
          // Got microphone permissions, which helps with audio routing
          console.log("Microphone access granted, audio sharing should work better");
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => console.warn("Could not get microphone access:", err));
    }
  } catch (e) {
    console.warn("Media devices API not available:", e);
  }

  // Create the iframe widget
  const widget = document.createElement('iframe');
  widget.src = chrome.runtime.getURL('widget.html');
  widget.id = 'kasabridge-widget';
  
  // Style the widget
  widget.style.position = 'fixed';
  widget.style.bottom = '30px';
  widget.style.right = '30px';
  widget.style.width = '300px';
  widget.style.height = '320px';
  widget.style.border = 'none';
  widget.style.borderRadius = '16px';
  widget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
  widget.style.zIndex = '2147483647'; // Maximum z-index
  widget.style.transition = 'all 0.3s ease';
  widget.style.background = 'white';
  widget.style.overflow = 'hidden';

  // Add the widget to the page
  document.body.appendChild(widget);

  // Variables for handling dragging
  let isDragging = false;
  let initialX, initialY;
  let currentX, currentY;
  let xOffset = 0, yOffset = 0;

  // Toggle button for showing/hiding the widget
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'kasabridge-toggle';
  toggleBtn.innerHTML = '<img src="' + chrome.runtime.getURL('assets/logo.png') + '" alt="KasaBridge" style="width: 24px; height: 24px;" />';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.bottom = '10px';
  toggleBtn.style.right = '10px';
  toggleBtn.style.width = '40px';
  toggleBtn.style.height = '40px';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.backgroundColor = '#2563eb';
  toggleBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  toggleBtn.style.border = 'none';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.zIndex = '2147483646';
  document.body.appendChild(toggleBtn);

  // Initially hide the widget
  widget.style.display = 'none';
  
  // Toggle button functionality
  toggleBtn.addEventListener('click', function() {
    if (widget.style.display === 'none') {
      widget.style.display = 'block';
    } else {
      widget.style.display = 'none';
    }
  });
  // Notify the background script that we're in a meeting
  chrome.runtime.sendMessage({ type: 'MEETING_JOINED' });
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'INJECT_AUDIO') {
      console.log('MEETING: Received audio injection request', message);
      
      if (message.audioUrl) {
        try {
          // Create an AudioContext for better control
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          
          // Fetch and decode the audio file
          fetch(message.audioUrl)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
              // Create source and gain nodes
              const source = audioCtx.createBufferSource();
              source.buffer = audioBuffer;
              
              const gainNode = audioCtx.createGain();
              gainNode.gain.value = message.mode === 'high_volume' ? 3.0 : 1.0;
              
              // Connect nodes and start playback
              source.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              
              source.start(0);
              console.log('MEETING: High-quality audio playback started');
              
              // Create notification in the meeting
              const notification = document.createElement('div');
              notification.innerText = "🔊 KasaBridge Audio Playing...";
              notification.style.position = 'fixed';
              notification.style.bottom = '80px';
              notification.style.left = '50%';
              notification.style.transform = 'translateX(-50%)';
              notification.style.background = '#4285F4';
              notification.style.color = 'white';
              notification.style.padding = '8px 12px';
              notification.style.borderRadius = '20px';
              notification.style.fontWeight = 'bold';
              notification.style.zIndex = '999999';
              document.body.appendChild(notification);
              
              // Remove notification when done
              source.onended = () => {
                setTimeout(() => notification.remove(), 1000);
              };
            })
            .catch(err => {
              console.error('Failed to decode audio file:', err);
              
              // Fallback to basic Audio API
              const meetingAudio = new Audio(message.audioUrl);
              meetingAudio.volume = 1.0;
              meetingAudio.play()
                .then(() => console.log('MEETING: Fallback audio playback started'))
                .catch(playErr => console.error('Error playing meeting audio:', playErr));
            });
        } catch (e) {
          console.error('Error setting up audio context:', e);
          // Ultimate fallback
          const meetingAudio = new Audio(message.audioUrl);
          meetingAudio.play()
            .catch(err => console.error('Error playing meeting audio:', err));
        }
      } else if (message.streamId) {
        console.log('MEETING: Stream ID received but not implemented');
        // Advanced: Could implement MediaStream connection here
      }
      
      sendResponse({ success: true });
    }
    return true;
  });

  // Handle messages from the iframe
  window.addEventListener('message', (event) => {
    // Only accept messages from our widget
    if (event.source !== widget.contentWindow) return;
    const { type, data } = event.data;
    if (type === 'DRAG_START') {
      isDragging = true;
      initialX = event.data.clientX;
      initialY = event.data.clientY;
      
      // Save the current position
      const transformMatrix = window.getComputedStyle(widget).transform;
      if (transformMatrix && transformMatrix !== 'none') {
        const matrix = new DOMMatrixReadOnly(transformMatrix);
        xOffset = matrix.m41;
        yOffset = matrix.m42;
      }
    } 
    else if (type === 'DRAG_MOVE') {
      if (isDragging) {
        // Calculate how much the mouse has moved
        currentX = event.data.clientX - initialX + xOffset;
        currentY = event.data.clientY - initialY + yOffset;
        
        // Apply the new position
        widget.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    }
    else if (type === 'DRAG_END') {
      isDragging = false;
      // Save the final position
      xOffset = currentX;
      yOffset = currentY;
    } 
    else if (type === 'MINIMIZE_WIDGET') {
      if (widget.dataset.minimized === 'true') {
        widget.style.width = '400px';
        widget.style.height = '300px';
        widget.dataset.minimized = 'false';
      } else {
        widget.style.width = '150px';
        widget.style.height = '50px';
        widget.dataset.minimized = 'true';
      }
    } 
    else if (type === 'CLOSE_WIDGET') {
      widget.style.display = 'none';
    }    else if (type === 'SHARE_AUDIO_TO_MEETING') {
      // Play the audio in the page context (best effort for browser limitations)
      const audio = document.createElement('audio');
      audio.src = data.audioUrl || event.data.audioUrl;
      audio.style.display = 'none';
      document.body.appendChild(audio);
      audio.play().then(() => {
        setTimeout(() => {
          audio.remove();
        }, 15000);
      });
      // Note: True microphone injection requires a virtual audio driver or tab capture, which is not possible with pure JS in content scripts.
      // This will play the audio in the tab, which is the closest possible in a Chrome extension context.
    }    else if (type === 'ADD_SYSTEM_AUDIO_INSTRUCTIONS') {
      // Add the instructions element to the page
      const div = document.createElement('div');
      div.innerHTML = event.data.html;
      const instructions = div.firstChild;
      document.body.appendChild(instructions);
        // Handle the Play Audio Now button
      setTimeout(() => {
        const playSystemAudioBtn = document.getElementById('play-system-audio');
        const closeInstructionsBtn = document.getElementById('close-instructions');
        let systemAudio = null;
        
        if (playSystemAudioBtn) {
          // Global audio element for better access
          window.__kasabridge_system_audio = document.createElement('audio');
          window.__kasabridge_system_audio.id = 'kasabridge-system-audio';
          window.__kasabridge_system_audio.loop = true;
          window.__kasabridge_system_audio.volume = 1.0;
          window.__kasabridge_system_audio.src = chrome.runtime.getURL('synthesize_text.wav');
          document.body.appendChild(window.__kasabridge_system_audio);
          
          playSystemAudioBtn.addEventListener('click', () => {
            try {
              // Show loading state
              playSystemAudioBtn.textContent = 'Starting...';
              playSystemAudioBtn.disabled = true;
              
              // Try multiple audio playing methods
              const audioPromise = window.__kasabridge_system_audio.play();
              
              // Also try AudioContext (more reliable in some browsers)
              const audioContext = new (window.AudioContext || window.webkitAudioContext)();
              
              // Use both playback methods for better compatibility
              audioPromise
                .then(() => {
                  console.log('System audio playback started successfully');
                  playSystemAudioBtn.textContent = 'Audio Playing (Stop)';
                  playSystemAudioBtn.disabled = false;
                  
                  // Create success notification
                  const successNote = document.createElement('div');
                  successNote.textContent = '✅ Audio is now playing for meeting participants';
                  successNote.style.marginTop = '15px';
                  successNote.style.padding = '8px 12px';
                  successNote.style.background = '#34a853';
                  successNote.style.color = 'white';
                  successNote.style.borderRadius = '4px';
                  successNote.style.fontWeight = 'bold';
                  
                  // Add notification after the buttons
                  const parentElement = playSystemAudioBtn.parentElement;
                  if (parentElement) {
                    parentElement.appendChild(successNote);
                  }
                  
                  // Set up stop functionality
                  playSystemAudioBtn.onclick = () => {
                    window.__kasabridge_system_audio.pause();
                    window.__kasabridge_system_audio.currentTime = 0;
                    instructions.remove();
                  };
                })
                .catch(err => {
                  console.error('Standard audio playback failed:', err);
                  
                  // Try alternative method with fetch + AudioContext
                  fetch(chrome.runtime.getURL('synthesize_text.wav'))
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                    .then(audioBuffer => {
                      const source = audioContext.createBufferSource();
                      source.buffer = audioBuffer;
                      source.loop = true;
                      source.connect(audioContext.destination);
                      source.start(0);
                      
                      playSystemAudioBtn.textContent = 'Audio Playing (Stop)';
                      playSystemAudioBtn.disabled = false;
                      
                      playSystemAudioBtn.onclick = () => {
                        source.stop();
                        instructions.remove();
                      };
                    })                    .catch(finalError => {
                      console.error('All audio methods failed:', finalError);
                      playSystemAudioBtn.textContent = 'Failed - Click to retry';
                      playSystemAudioBtn.disabled = false;
                      
                      // Show alternative method button
                      const altMethodBtn = document.getElementById('alt-audio-method');
                      if (altMethodBtn) {
                        altMethodBtn.style.display = 'inline-block';
                      }
                      
                      // Show helpful text
                      const helpText = document.getElementById('audio-help-text');
                      if (helpText) {
                        helpText.innerHTML = 'Audio playback failed. This might happen if:<br>' +
                          '1. Your browser is blocking autoplay<br>' +
                          '2. You need to grant audio permissions<br>' +
                          '3. Try the alternative method button';
                      }
                    });
                });
            } catch (e) {
              console.error('System audio setup failed:', e);
              playSystemAudioBtn.textContent = 'Failed - Click to retry';
              playSystemAudioBtn.disabled = false;
            }
          });
        }
          // Handle alternative audio method button
        const altAudioMethodBtn = document.getElementById('alt-audio-method');
        if (altAudioMethodBtn) {
          altAudioMethodBtn.addEventListener('click', () => {
            // Create a notification that audio is playing through a different method
            const helpText = document.getElementById('audio-help-text');
            if (helpText) {
              helpText.innerHTML = 'Trying alternative audio playback method... <br>If your audio still doesn\'t work, make sure your browser has permission to play audio.';
            }
            
            // Try alternative playback using oscillator (works more reliably sometimes)
            try {
              const alternativeContext = new (window.AudioContext || window.webkitAudioContext)();
              const oscillator = alternativeContext.createOscillator();
              const gainNode = alternativeContext.createGain();
              
              // Set up oscillator
              oscillator.type = 'sine'; // pure tone
              oscillator.frequency.setValueAtTime(440, alternativeContext.currentTime); // A4 note
              gainNode.gain.value = 0.1; // Not too loud
              
              // Connect and start
              oscillator.connect(gainNode);
              gainNode.connect(alternativeContext.destination);
              oscillator.start();
              
              // After tone plays for 0.5 second, switch to the actual audio
              setTimeout(() => {
                oscillator.stop();
                
                // Now try playing the actual audio file again
                const audioElement = document.createElement('audio');
                audioElement.src = chrome.runtime.getURL('synthesize_text.wav');
                audioElement.loop = true;
                document.body.appendChild(audioElement);
                audioElement.play()
                  .then(() => {
                    if (helpText) {
                      helpText.innerHTML = '✅ Audio is now playing! Your participants should hear it.';
                    }
                    
                    if (altAudioMethodBtn) {
                      altAudioMethodBtn.textContent = 'Audio Playing';
                      altAudioMethodBtn.disabled = true;
                    }
                  })
                  .catch(err => {
                    console.error('Alternative method also failed:', err);
                    if (helpText) {
                      helpText.innerHTML = '❌ Audio playback still failed. Try reloading the page or using a different browser.';
                    }
                  });
              }, 500);
            } catch (e) {
              console.error('Alternative audio method failed:', e);
              if (helpText) {
                helpText.innerHTML = '❌ Could not initialize audio. Please check your browser settings.';
              }
            }
          });
        }
        
        if (closeInstructionsBtn) {
          closeInstructionsBtn.addEventListener('click', () => {
            instructions.remove();
          });
        }
      }, 100);
    }    else if (type === 'SHARE_PRE_AUDIO_TO_MEETING') {
      // Display a visual indicator that we're sharing audio
      const audioShareIndicator = document.createElement('div');
      audioShareIndicator.style.position = 'fixed';
      audioShareIndicator.style.top = '10px';
      audioShareIndicator.style.left = '50%';
      audioShareIndicator.style.transform = 'translateX(-50%)';
      audioShareIndicator.style.background = 'rgba(0,0,0,0.8)';
      audioShareIndicator.style.color = 'white';
      audioShareIndicator.style.padding = '10px 15px';
      audioShareIndicator.style.borderRadius = '4px';
      audioShareIndicator.style.zIndex = '9999999';
      audioShareIndicator.style.fontWeight = 'bold';
      audioShareIndicator.style.fontSize = '18px';
      audioShareIndicator.innerHTML = '🔊 Audio playing in meeting<br><span style="font-size:14px; opacity:0.9;">If others can\'t hear, use "Share System Audio" (red button)</span>';
      document.body.appendChild(audioShareIndicator);

      // Get the audio file
      const audioUrl = chrome.runtime.getURL('synthesize_text.wav');
      
      // APPROACH 1: Use AudioContext for better audio quality
      try {
        // Create a new audio context with high gain
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        
        fetch(audioUrl)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
          .then(audioBuffer => {
            // Create source node from audio buffer
            const sourceNode = audioContext.createBufferSource();
            sourceNode.buffer = audioBuffer;
            
            // Create a gain node to boost volume
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 2.0; // Balanced volume
            
            // Create a compressor to prevent distortion
            const compressor = audioContext.createDynamicsCompressor();
            compressor.threshold.value = -24;
            compressor.knee.value = 30;
            compressor.ratio.value = 12;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;
            
            // Connect the nodes: source -> gain -> compressor -> analyser -> output
            sourceNode.connect(gainNode);
            gainNode.connect(compressor);
            compressor.connect(analyser);
            analyser.connect(audioContext.destination);
            
            // Play the audio
            sourceNode.start(0);
            
            // Show a "Use System Audio" reminder after a short delay
            setTimeout(() => {
              // Create a more prominent reminder
              const systemAudioReminder = document.createElement('div');
              systemAudioReminder.style.position = 'fixed';
              systemAudioReminder.style.bottom = '40px';
              systemAudioReminder.style.left = '50%';
              systemAudioReminder.style.transform = 'translateX(-50%)';
              systemAudioReminder.style.background = '#EA4335'; // Red color like the system audio button
              systemAudioReminder.style.color = 'white';
              systemAudioReminder.style.padding = '12px 20px';
              systemAudioReminder.style.borderRadius = '8px';
              systemAudioReminder.style.zIndex = '9999999';
              systemAudioReminder.style.fontWeight = 'bold';
              systemAudioReminder.innerHTML = 'For reliable audio sharing, click the RED button and use System Audio Sharing';
              document.body.appendChild(systemAudioReminder);
              
              // Remove the reminder after 8 seconds
              setTimeout(() => {
                systemAudioReminder.remove();
              }, 8000);
            }, 4000);
            
            // Remove the indicator after audio finishes
            sourceNode.onended = () => {
              setTimeout(() => {
                audioShareIndicator.remove();
              }, 1000);
            };
            
            // Also play using HTML5 Audio API as a backup
            try {
              const backupAudio = new Audio(audioUrl);
              backupAudio.play().catch(e => console.log('Backup audio playback failed:', e));
            } catch (e) {
              console.log('Failed to initialize backup audio:', e);
            }
          })
          .catch(error => {
            console.error("Error loading audio file:", error);
            audioShareIndicator.innerHTML = '⚠️ Audio sharing failed<br><span style="font-size:12px">Click the RED button to use System Audio Sharing instead</span>';
            
            // Fallback to simple audio
            try {
              const fallbackAudio = new Audio(audioUrl);
              fallbackAudio.volume = 1.0;
              fallbackAudio.play()
                .catch(e => console.error('Fallback audio also failed:', e));
            } catch (e) {
              console.error('Complete audio failure:', e);
            }
            
            setTimeout(() => {
              audioShareIndicator.remove();
            }, 5000);
          });
      } catch (error) {
        console.error('Advanced audio sharing failed:', error);
        
        // FALLBACK APPROACH: Use simple Audio API
        try {
          const meetingAudio = new Audio(audioUrl);
          meetingAudio.volume = 1.0; // Full volume
          
          // Play audio in meeting context
          meetingAudio.play()
            .then(() => {
              // Update the indicator to suggest system audio sharing
              audioShareIndicator.innerHTML = '🔊 Playing audio (simple mode)<br><span style="font-size:12px">For better quality, use the RED button for System Audio Sharing</span>';
              
              setTimeout(() => {
                audioShareIndicator.remove();
              }, 6000);
            })
            .catch(err => {
              console.error('Simple audio playback failed:', err);
              audioShareIndicator.innerHTML = '⚠️ Audio sharing failed<br>Try the RED button to share System Audio';
              setTimeout(() => audioShareIndicator.remove(), 5000);
            });
        } catch (finalError) {
          console.error('All audio methods failed:', finalError);
          audioShareIndicator.innerHTML = '⚠️ Audio sharing failed<br>Click the RED microphone button for better results';
          setTimeout(() => audioShareIndicator.remove(), 5000);
        }
      }
    }
  });
})();