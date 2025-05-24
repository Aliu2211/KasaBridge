/**
 * Mock function to simulate sign language detection
 * In a real application, this would use TensorFlow.js or Mediapipe
 */
export async function mockSignDetection(): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Array of sample phrases that would be detected from sign language
  const samplePhrases = [
    "Hello, how are you?",
    "My name is John",
    "I need help please",
    "Thank you very much",
    "I am hungry",
    "Where is the bathroom?",
    "Nice to meet you",
    "Can you help me?",
    "I don't understand",
    "Please speak slowly",
  ]

  // Randomly select a phrase to simulate detection
  const randomIndex = Math.floor(Math.random() * samplePhrases.length)
  return samplePhrases[randomIndex]
}
