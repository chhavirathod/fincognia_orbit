import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";
// import AvatarViewer from "@/components/AvatarViewer";
import MicButton from "@/components/MicButton";
import ChatPanel from "@/components/ChatPanel";
import UserHeader from "@/components/UserHeader";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import { useVoiceInput } from "@/hooks/useVoiceInput";

const AppPage = () => {
  const navigate = useNavigate();
  const { messages, isThinking, isSpeaking, sendMessage } = useGeminiChat();
  const {
    isListening,
    transcript,
    language,
    setLanguage,
    startListening,
    stopListening,
    speakText,
  } = useVoiceInput();

  // Handle transcript changes: Send to Gemini only when listening stops
  useEffect(() => {
    if (transcript && !isListening) {
      sendMessage(transcript);
    }
  }, [transcript, isListening, sendMessage]);

  // Speak Gemini responses using female voice
  useEffect(() => {
    if (!isThinking && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        speakText(lastMessage.content, {
          language,
          voiceGender: "female",
        });
      }
    }
  }, [isThinking, messages, language, speakText]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 z-20 px-6 py-6 flex items-center justify-between"
      >
        <motion.h1
          className="text-2xl font-bold text-gradient"
          whileHover={{ scale: 1.05 }}
        >
          FinCognia
        </motion.h1>
        <UserHeader />
      </motion.header>

      {/* Avatar Center Stage */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[600px]">
          {/* <AvatarViewer isSpeaking={isSpeaking} /> */}
        </div>
      </div>

      {/* Bottom Left: Chat Panel */}
      <div className="absolute bottom-8 left-8 z-10">
        <ChatPanel messages={messages} isThinking={isThinking} />
      </div>

      {/* Bottom Center: Mic Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <MicButton isListening={isListening} onClick={handleMicClick} />
      </div>

      {/* Bottom Left Center: Language Selector */}
      <div className="absolute bottom-8 left-[30%] z-10">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 bg-black/20 text-white rounded-lg backdrop-blur-md"
        >
          <option value="en-US">English (US)</option>
          <option value="hi-IN">Hindi (India)</option>
          <option value="es-ES">Spanish (Spain)</option>
          <option value="fr-FR">French (France)</option>
          <option value="de-DE">German (Germany)</option>
        </select>
      </div>

      {/* Bottom Right: Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-8 right-8 z-10"
      >
        <Button
          variant="glass"
          onClick={() => navigate("/dashboard")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          Go Next
        </Button>
      </motion.div>

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-glow-pulse" />
      </div>
    </div>
  );
};

export default AppPage;
