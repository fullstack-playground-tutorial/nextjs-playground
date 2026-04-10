import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateFlashcards(text: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    Based on the following text, generate a list of flashcards. 
    Each flashcard should have a "front" (question or concept) and a "back" (answer or definition).
    The output must be a valid JSON array of objects with "front" and "back" keys.
    Text: "${text}"
    
    Format:
    [
      {"front": "...", "back": "..."},
      ...
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean up the response text in case Gemini wraps it in markdown code blocks
    const cleanedText = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}
