import { useState, useCallback } from "react";

export interface GeminiResponse {
  textResponse: string;
  audioUrl?: string;
  isThinking: boolean;
  isSpeaking: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useGeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your FinCognia AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  // Add a custom system prompt for Gemini
  const SYSTEM_PROMPT = `
You are FinCognia — an intelligent financial assistant.
Your role is to help users manage money, understand spending, and handle transactions clearly.
Respond naturally, concisely, and confidently.
If a user gives a financial instruction (like "send 500 rupees to Moksh"),
acknowledge it and explain how it would be processed.
Never fake confirmations, just describe the action.
`;

  const sendMessage = useCallback(
    async (userInput: string) => {
      if (!GEMINI_API_KEY) {
        console.error("Missing Gemini API key in environment variables.");
        return;
      }

      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content: userInput,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      try {
        const response = await fetch(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `
        You are FinCognia — an intelligent financial assistant.
        Your role is to help users manage money, understand spending, and handle transactions clearly.
        Respond naturally, concisely, and confidently.
        If a user gives a financial instruction (like "send 500 rupees to Moksh"),
        acknowledge it and explain how it would be processed.
        Never fake confirmations, just describe the action.
        Keep all the answers under 20 words, and remove all the aestriks and emojis. 

User: ${userInput}
          `.trim(),
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok)
          throw new Error(`Gemini API error: ${response.statusText}`);

        const data = await response.json();

        const textResponse =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I couldn't generate a response right now.";

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: textResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsThinking(false);

        // === Optional: Speech synthesis (text → audio) ===
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(textResponse);
        utterance.pitch = 1;
        utterance.rate = 1.05;
        utterance.voice =
          speechSynthesis
            .getVoices()
            .find((v) => v.name.toLowerCase().includes("female")) || null;

        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Gemini API call failed:", error);
        setIsThinking(false);

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content:
            "Something went wrong connecting to Gemini API. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    },
    [GEMINI_API_KEY]
  );

  return {
    messages,
    isThinking,
    isSpeaking,
    sendMessage,
  };
}
