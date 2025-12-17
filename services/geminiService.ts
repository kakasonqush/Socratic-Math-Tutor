import { GoogleGenAI, Content, Part } from "@google/genai";
import { ChatMessage, Role } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-pro-preview';

/**
 * Converts internal ChatMessage format to the SDK's Content format.
 */
const mapMessagesToContent = (messages: ChatMessage[]): Content[] => {
  return messages.map((msg) => {
    const parts: Part[] = [];
    
    // If there is an image, add it as a part
    if (msg.image) {
      // Extract base64 data and mime type from the data URL
      // Format: data:image/png;base64,.....
      const matches = msg.image.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
    }

    // Add text part
    if (msg.text) {
      parts.push({ text: msg.text });
    }

    return {
      role: msg.role,
      parts: parts,
    };
  });
};

export const streamGeminiResponse = async (
  history: ChatMessage[],
  newMessageText: string,
  newMessageImage: string | null,
  onChunk: (text: string) => void
): Promise<string> => {
  
  // 1. Prepare history including the new message
  const previousHistory = mapMessagesToContent(history);
  
  const newParts: Part[] = [];
  if (newMessageImage) {
      const matches = newMessageImage.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        newParts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
  }
  if (newMessageText) {
    newParts.push({ text: newMessageText });
  }

  const currentContent: Content = {
    role: Role.USER,
    parts: newParts,
  };

  const contents = [...previousHistory, currentContent];

  // 2. Call the API
  try {
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: contents,
      config: {
        thinkingConfig: {
            thinkingBudget: 32768, // Max budget for deep reasoning
        },
        // We do NOT set maxOutputTokens as per requirements to allow full expression
        systemInstruction: `You are a compassionate, Socratic AI math tutor. 
        
        Your Goal: Help the student understand the math problem step-by-step. NEVER solve the problem completely in one go.
        
        Guidelines:
        1. **Compassion**: Be warm, encouraging, and patient. Math can be scary; make it safe.
        2. **Analyze First**: When an image or problem is provided, identify the specific math topic and the very first step required to solve it.
        3. **Socratic Method**: 
           - Do not give the answer. 
           - Ask a guiding question to nudge the user toward the first step.
           - If the user provides a step, validate it. If it's wrong, gently correct them by explaining the *why*.
        4. **Explain "Why"**: If the user asks "Why did we do that?", stop moving forward. Explain the underlying mathematical concept or theorem simply and intuitively. Use analogies if helpful.
        5. **Thinking**: Use your thinking budget to plan your pedagogical strategy. Decide where the user might get stuck and how to scaffold the learning.
        6. **Formatting**: Use Markdown for clear structure. You can use LaTeX-style formatting (e.g., $x^2$) for math expressions if it helps clarity, but keep it readable.

        Scenario:
        - User uploads an integral.
        - You: "That looks like an interesting calculus problem! To start, do you recognize what rule we might need for this function?"
        - User: "The chain rule?"
        - You: "Exactly! That's a great start. How would you apply the chain rule here?"
        
        Stick to this persona strictly.`,
      },
    });

    let fullText = "";

    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(fullText);
      }
    }

    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
