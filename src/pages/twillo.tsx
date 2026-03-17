"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Send, Mic, Check, AlertCircle, Camera } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  paymentCard?: {
    recipient: string;
    amount: number;
    upiId: string;
    qrCode: string;
  };
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function FinCogniaApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: `Hello! I'm your financial companion. Try saying "send 500 rupees to Moksh" or ask me anything about your finances.`,
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          setInput(transcript);
          handleVoiceCommand(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const generateQRCode = async (data: string): Promise<string> => {
    try {
      const encodedData = encodeURIComponent(data);
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
    } catch (error) {
      console.error("QR generation error:", error);
      return "";
    }
  };

  const getAvatarColor = (name: string): string => {
    const colors = ["#8B6F47", "#D4A574", "#A0826D", "#6B5344"];
    const hash = name.charCodeAt(0) % colors.length;
    return colors[hash];
  };

  const handleEyeScan = async () => {
    setIsScanning(true);
    showToast("🔍 Eye scan initiated...", "success");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      scanTimeoutRef.current = setTimeout(async () => {
        if (videoRef.current && canvasRef.current) {
          const context = canvasRef.current.getContext("2d");
          if (context) {
            context.drawImage(
              videoRef.current,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
          }
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        showToast("✓ Eye scan complete!", "success");

        const biometricCommands = [
          "send 500 rupees to Moksh",
          "send 1000 rupees to Arjun",
          "send 250 rupees to Priya",
        ];
        const randomCommand =
          biometricCommands[
            Math.floor(Math.random() * biometricCommands.length)
          ];

        await handleVoiceCommand(randomCommand);
        setIsScanning(false);
      }, 20000);
    } catch (error) {
      console.error("Camera access error:", error);
      showToast("✗ Camera access denied", "error");
      setIsScanning(false);
    }
  };

  const stopEyeScan = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    setIsScanning(false);
  };

  const handleVoiceCommand = async (transcript: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: transcript,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // ✅ Approved contacts with UPI IDs only
    const contacts = {
      vansh: {
        name: "Vansh Momaya",
        upi: "vanshmomaya9@oksbi",
      },
      moksh: {
        name: "Moksh Jhaveri",
        upi: "mokshjhaveri554@oksbi",
      },
      daksh: {
        name: "Daksh Goyal",
        upi: "dakshgoyal990@okicici",
      },
      chhavi: {
        name: "Chhavi Rathod",
        upi: "chhavirathod05@okaxis",
      },
    };

    // ✅ Match user phrase like “send 500 to moksh” or “pay 200 rupees to daksh”
    const paymentMatch = transcript.match(
      /(send|pay)\s+(\d+)\s*(?:rupees?)?\s*(?:to)?\s*(\w+)/i
    );

    if (paymentMatch) {
      const amount = Number(paymentMatch[2]);
      const recipientKey = paymentMatch[3].toLowerCase();

      // Check if recipient exists
      if (!contacts[recipientKey]) {
        const errorMsg: Message = {
          id: Date.now().toString(),
          text: `Sorry, I can only process payments for Vansh, Moksh, Daksh, or Chhavi right now.`,
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        showToast("❌ Recipient not recognized", "error");
        return;
      }

      const contact = contacts[recipientKey];

      // ✅ Create encoded UPI payment link
      const upiUrl = encodeURI(
        `upi://pay?pa=${contact.upi}&am=${amount}&tn=Payment to ${contact.name}`
      );

      // ✅ Generate dynamic QR code from free API
      const qrImageUrl = await generateQRCode(upiUrl);

      // ✅ Display messages in chat
      const confirmMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Generating your payment QR for ₹${amount} to ${contact.name}...`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmMsg]);

      const qrMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: `Payment QR for ${contact.name}`,
        sender: "assistant",
        timestamp: new Date(),
        paymentCard: {
          recipient: contact.name,
          amount,
          upiId: contact.upi,
          qrCode: qrImageUrl,
        },
      };
      setMessages((prev) => [...prev, qrMsg]);

      const finalMsg: Message = {
        id: (Date.now() + 3).toString(),
        text: `✅ QR code ready! Scan it using any UPI app to complete the payment.`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, finalMsg]);

      showToast(`✅ Payment QR generated for ${contact.name}`, "success");
    } else {
      // Default fallback if not a payment message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: `I understand you said: "${transcript}". Try saying something like "send 500 to Moksh" or "pay 300 to Vansh".`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await handleVoiceCommand(input);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0A0F2D 0%, #1F2A6C 100%)",
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-10"
      >
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFC6] to-blue-500 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FinCognia</h1>
            <p className="text-xs text-gray-300">
              Voice-Enabled Financial Companion
            </p>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4 pb-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="w-full max-w-md">
                  {msg.paymentCard ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8 shadow-2xl"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                          style={{
                            backgroundColor: getAvatarColor(
                              msg.paymentCard.recipient
                            ),
                          }}
                        >
                          {msg.paymentCard.recipient.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {msg.paymentCard.recipient.charAt(0).toUpperCase() +
                            msg.paymentCard.recipient.slice(1)}{" "}
                        </h3>
                      </div>

                      <div className="bg-white rounded-xl p-4 mb-6 flex justify-center">
                        <img
                          src={msg.paymentCard.qrCode || "/placeholder.svg"}
                          alt="Payment QR Code"
                          className="w-52 h-52"
                        />
                      </div>

                      <div className="text-center mb-6">
                        <p className="text-gray-600 font-medium">
                          UPI ID:{" "}
                          <span className="text-gray-800 font-semibold">
                            {msg.paymentCard.upiId}
                          </span>
                        </p>
                      </div>

                      <div className="bg-blue-100 rounded-lg p-3 text-center mb-4">
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{msg.paymentCard.amount}
                        </p>
                      </div>

                      <p className="text-center text-gray-600 text-sm font-medium">
                        Scan to pay with any UPI app
                      </p>
                    </motion.div>
                  ) : (
                    <div
                      className={`rounded-lg p-4 backdrop-blur-md ${
                        msg.sender === "user"
                          ? "bg-[#00FFC6]/20 border border-[#00FFC6]/50 text-white"
                          : "bg-white/10 border border-white/20 text-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-40"
          >
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
              <h2 className="text-white text-xl font-bold mb-4">Eye Scan</h2>
              <video
                ref={videoRef}
                className="w-full rounded-lg bg-black mb-4"
                style={{ maxHeight: "300px" }}
              />
              <p className="text-gray-300 text-center text-sm mb-4">
                Scanning... {Math.ceil(20)}s remaining
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopEyeScan}
                className="w-full bg-red-500/80 hover:bg-red-600 text-white py-2 rounded-lg transition-all"
              >
                Cancel Scan
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" width={640} height={480} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-md border-t border-white/10 p-4 sticky bottom-0"
      >
        <form
          onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or use the mic..."
            disabled={isSending || isScanning}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFC6]/50 focus:ring-1 focus:ring-[#00FFC6]/30 disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleEyeScan}
            disabled={isSending || isScanning}
            className={`p-2 rounded-lg transition-all ${
              isScanning
                ? "bg-purple-500/80 text-white"
                : "bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
            } disabled:opacity-50`}
          >
            <Camera className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={toggleListening}
            disabled={isSending || isScanning}
            className={`p-2 rounded-lg transition-all ${
              isListening
                ? "bg-red-500/80 text-white"
                : "bg-[#00FFC6]/20 border border-[#00FFC6]/50 text-[#00FFC6] hover:bg-[#00FFC6]/30"
            } disabled:opacity-50`}
          >
            <Mic className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSending || !input.trim() || isScanning}
            className="p-2 bg-[#00FFC6]/20 border border-[#00FFC6]/50 text-[#00FFC6] rounded-lg hover:bg-[#00FFC6]/30 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>

      <div className="fixed bottom-24 right-4 z-50 space-y-2 max-w-xs">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg backdrop-blur-md border ${
                toast.type === "success"
                  ? "bg-green-500/20 border-green-500/50 text-green-100"
                  : "bg-red-500/20 border-red-500/50 text-red-100"
              }`}
            >
              {toast.type === "success" ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <p className="text-sm">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
