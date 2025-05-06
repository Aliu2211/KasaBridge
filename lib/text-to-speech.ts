/**
 * Generate Akan speech audio using Ghana NLP TTS API
 * @param akanText Akan text to convert to speech
 * @returns A blob URL for the audio
 */
export async function generateAkanAudio(akanText: string): Promise<string> {
  const apiUrl = "https://translation-api.ghananlp.org/tts/v1/speak";
  const speaker = "ak_slt"; // You can fetch available speakers from /speakers if you want to let users choose

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: akanText, speaker_id: speaker })
    });
    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error generating Akan audio:", error);
    throw error;
  }
}

/**
 * Translate English text to Akan using Ghana NLP Translation API
 * @param englishText English text to translate
 * @returns Akan translation as a string
 */
export async function translateEnglishToAkan(englishText: string): Promise<string> {
  const apiUrl = "https://translation-api.ghananlp.org/translate";
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_language: "en",
        target_language: "ak",
        text: englishText
      })
    });
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.translation) throw new Error("No translation returned from API");
    return data.translation;
  } catch (error) {
    console.error("Error translating English to Akan:", error);
    throw error;
  }
}

/**
 * Chain English-to-Akan translation and Akan TTS
 * @param englishText English text to convert to Akan speech
 * @returns A blob URL for the Akan audio
 */
export async function generateAkanSpeechFromEnglish(englishText: string): Promise<string> {
  const akanText = await translateEnglishToAkan(englishText);
  return generateAkanAudio(akanText);
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
