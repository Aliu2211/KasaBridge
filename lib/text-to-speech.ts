/**
 * Real implementation: Generate Akan audio using Ghana NLP TTS API
 * https://ghana-nlp-tts.onrender.com/docs#/default/tts_tts_post
 */
export async function generateAkanAudio(text: string): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("generateAkanAudio can only be run in the browser.")
  }
  try {
    const response = await fetch("https://ghana-nlp-tts.onrender.com/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "audio/mp3"
      },
      body: JSON.stringify({
        text: text,
        language: "tw",
        speaker_id: "twi_speaker_4" // Use a valid Twi speaker
      })
    });
    if (!response.ok) {
      // Try to log the error response for debugging
      let errorText = "";
      try {
        errorText = await response.text();
      } catch {}
      console.error(`TTS API error: ${response.status} - ${errorText}`);
      throw new Error(`TTS API error: ${response.status} - ${errorText}`);
    }
    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("Error generating Akan audio via API, using fallback:", error);
    // Fallback to simulated audio
    return generateFallbackAudio(text);
  }
}

// Fallback simulation (unchanged)
async function generateFallbackAudio(text: string): Promise<string> {
  // Ensure this runs only on the client
  if (typeof window === "undefined") {
    throw new Error("generateFallbackAudio can only be run in the browser.")
  }

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Create an audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  // Configure the oscillator
  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4 note

  // Configure the gain node (volume)
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)

  // Connect the nodes
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Create a simple pattern based on the text length to simulate speech
  const duration = Math.min(Math.max(text.length * 0.1, 2), 10) // Between 2-10 seconds

  // Start and stop the oscillator
  oscillator.start()

  // Create variations in the sound to simulate speech
  const wordCount = text.split(" ").length
  for (let i = 0; i < wordCount; i++) {
    const time = audioContext.currentTime + (i * duration) / wordCount
    // Vary the frequency for each "word"
    oscillator.frequency.setValueAtTime(300 + Math.random() * 200, time)
    // Add slight pauses between words
    gainNode.gain.setValueAtTime(0.1, time)
    gainNode.gain.setValueAtTime(0.05, time + (duration / wordCount) * 0.7)
  }

  oscillator.stop(audioContext.currentTime + duration)

  // Create a MediaStream from the audio context
  const dest = audioContext.createMediaStreamDestination()
  gainNode.connect(dest)

  // Record the audio to a blob
  const mediaRecorder = new MediaRecorder(dest.stream)
  const chunks: BlobPart[] = []

  return new Promise((resolve) => {
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" })
      const url = URL.createObjectURL(blob)
      resolve(url)
    }

    mediaRecorder.start()
    setTimeout(() => mediaRecorder.stop(), duration * 1000)
  })
}

/**
 * Speaks the given text in Akan language
 * Generates and plays the audio directly
 */
export async function speakAkan(text: string): Promise<void> {
  try {
    // Generate the audio URL
    const audioUrl = await generateAkanAudio(text);
    
    // Create an audio element to play the speech
    const audio = new Audio(audioUrl);
    
    // Play the audio
    await audio.play();
    
    // Return a promise that resolves when audio finishes playing
    return new Promise((resolve) => {
      audio.onended = () => {
        resolve();
      };
    });
  } catch (error) {
    console.error("Error speaking Akan:", error);
    throw error;
  }
}
