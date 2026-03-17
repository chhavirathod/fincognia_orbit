import { useState, useCallback, useRef, useEffect } from "react";

export function useVoiceInput() {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [language, setLanguage] = useState<string>("en-US");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 🗣️ Speech Synthesis (female voice by default)
  const speakText = useCallback(
    (text: string, options?: { language?: string; voiceGender?: string }) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        console.warn("Speech synthesis not supported in this environment.");
        return;
      }

      const lang = options?.language || "en-US";
      const voiceGender = options?.voiceGender || "female";
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      const selectedVoice = voices.find(
        (voice) =>
          voice.lang === lang &&
          voice.name.toLowerCase().includes(voiceGender.toLowerCase())
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        console.warn(`No ${voiceGender} voice found for language: ${lang}`);
      }

      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    },
    []
  );

  // Load voices on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // 🎙️ Start listening
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  }, [language]);

  // 🛑 Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  return {
    isListening,
    transcript,
    language,
    setLanguage,
    startListening,
    stopListening,
    speakText,
  };
}

// ✅ Fixed global declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
}
