"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, TrendingUp, DollarSign, IndianRupee, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const EXCHANGE_RATE = 82.75;

export default function NRIBankingPage(): JSX.Element {
  const [usBalance, setUsBalance] = useState<number>(12450); // Chase USD
  const [indiaBalance, setIndiaBalance] = useState<number>(850425.5); // HDFC INR
  const [command, setCommand] = useState<string>(""); // editable input
  const [isListening, setIsListening] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<"us" | "india" | null>(null);
  const recognitionRef = useRef<any | null>(null);

  // convert returns numeric converted value (USD -> INR or INR -> USD)
  const convertCurrency = (amount: number, from: "USD" | "INR"): number =>
    from === "USD" ? amount * EXCHANGE_RATE : amount / EXCHANGE_RATE;

  // ---------- Voice Recognition ----------
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "Voice Not Supported",
        description:
          "Please use Chrome or Edge (Desktop) to enable speech recognition.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      // keep the input editable for debugging; clear only if desired
      // setCommand("");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const txt = res[0].transcript;
        if (res.isFinal) finalTranscript += txt;
        else interimTranscript += txt;
      }

      // show interim text while listening
      setCommand((prev) =>
        finalTranscript ? finalTranscript : interimTranscript
      );

      // if final result arrived, process command
      if (finalTranscript) {
        handleVoiceCommand(finalTranscript.trim());
      }
    };

    recognition.onerror = (e: any) => {
      console.error("Speech recognition error", e);
      toast({
        title: "Speech Error",
        description: "Something went wrong with speech recognition. Try again.",
        variant: "destructive",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // ---------- Parse & Execute Command ----------
  const handleVoiceCommand = (inputText: string) => {
    if (!inputText || inputText.trim().length === 0) {
      toast({
        title: "Empty command",
        description: "Please speak or type a transfer command.",
        variant: "destructive",
      });
      return;
    }

    const raw = inputText;
    // normalize: lower, replace symbols, ensure spacing between currency words and numbers, normalize commas
    let text = raw
      .toLowerCase()
      // simplify common words to improve matching
      .replace(/into|in|to\s+my|account|bank|manager|project/gi, "to")
      // replace symbol $ and ₹ with words and add a space so "₹5000" => "rupee 5000"
      .replace(/\$/g, "dollar ")
      .replace(/₹/g, "rupee ")
      // normalize words
      .replace(/usd|dollars?/gi, "dollar")
      .replace(/inr|rupees?/gi, "rupee")
      // ensure there's a space between 'dollar'/'rupee' and numbers if attached (e.g. "rupee5000" -> "rupee 5000")
      .replace(/(rupee|dollar)(?=\d)/g, "$1 ")
      // remove extra multiple spaces
      .replace(/\s+/g, " ")
      .trim();

    // supports: "$1200", "1200 dollars", "5000 rupees", "rupee 5000", "1,200", etc.
    // regex allows optional currency word or symbol before/after the number, and accepts commas/periods
    const regex =
      /(transfer|send|move|pay)\s+(?:dollar\s*|rupee\s*|[$₹]\s*)?([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]+)?|[0-9]+(?:[.,][0-9]+)?)(?:\s*(?:dollar|rupee))?\s*(?:to|into)?\s*(india|us|hdfc|chase)?/i;

    const match = text.match(regex);

    if (!match) {
      toast({
        title: "Unrecognized Command 🤔",
        description:
          "Try: 'Transfer 1200 dollars to India' or 'Send ₹5000 to US'.",
        variant: "destructive",
      });
      return;
    }

    // normalize numeric string: remove thousand separators and convert comma decimal to dot
    const rawAmountStr = match[2].replace(/,/g, "");
    const amount = parseFloat(
      rawAmountStr.replace(/，/g, "").replace(/ /g, "")
    );
    const destination = (match[3] || "").toLowerCase();

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please specify a valid amount to transfer.",
        variant: "destructive",
      });
      return;
    }

    // Determine currency by presence of words or destination context
    const isUSD =
      text.includes("dollar") ||
      text.includes("$") ||
      (destination && destination.includes("india"));
    const isINR =
      text.includes("rupee") ||
      text.includes("₹") ||
      (destination && destination.includes("us"));

    // Direction heuristics:
    if (
      (isUSD && (destination.includes("india") || destination === "")) ||
      (isUSD && !isINR)
    ) {
      // USD -> INR
      handleTransferUSD(amount);
    } else if (
      (isINR && (destination.includes("us") || destination === "")) ||
      (isINR && !isUSD)
    ) {
      // INR -> USD
      handleTransferINR(amount);
    } else {
      // fallback heuristics
      if (isUSD) handleTransferUSD(amount);
      else if (isINR) handleTransferINR(amount);
      else {
        toast({
          title: "Could not determine currency",
          description:
            "Please include 'dollars' or 'rupees' (or say 'to India'/'to US').",
          variant: "destructive",
        });
      }
    }
  };

  // ---------- Transfer Handlers ----------
  const handleTransferUSD = (amountUSD: number) => {
    // USD -> INR
    if (usBalance < amountUSD) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds in Chase (USD).",
        variant: "destructive",
      });
      return;
    }

    const inrAmount = convertCurrency(amountUSD, "USD");

    // animate highlight and update balances
    setHighlight("us");
    setTimeout(
      () => setUsBalance((prev) => +(prev - amountUSD).toFixed(2)),
      250
    );
    setTimeout(() => {
      setHighlight("india");
      setIndiaBalance((prev) => +(prev + inrAmount).toFixed(2));
    }, 650);
    setTimeout(() => setHighlight(null), 1400);

    toast({
      title: "Transfer Successful",
      description: `$${amountUSD.toFixed(2)} → ₹${inrAmount.toFixed(2)} (HDFC)`,
    });

    // update editable input to show what happened (optional)
    setCommand(
      `Transferred $${amountUSD.toFixed(2)} to India (₹${inrAmount.toFixed(2)})`
    );
  };

  const handleTransferINR = (amountINR: number) => {
    // INR -> USD
    if (indiaBalance < amountINR) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds in HDFC (INR).",
        variant: "destructive",
      });
      return;
    }

    const usdAmount = convertCurrency(amountINR, "INR");

    setHighlight("india");
    setTimeout(
      () => setIndiaBalance((prev) => +(prev - amountINR).toFixed(2)),
      250
    );
    setTimeout(() => {
      setHighlight("us");
      setUsBalance((prev) => +(prev + usdAmount).toFixed(2));
    }, 650);
    setTimeout(() => setHighlight(null), 1400);

    toast({
      title: "Transfer Successful",
      description: `₹${amountINR.toFixed(2)} → $${usdAmount.toFixed(
        2
      )} (Chase)`,
    });

    setCommand(
      `Transferred ₹${amountINR.toFixed(2)} to US ($${usdAmount.toFixed(2)})`
    );
  };

  // ---------- UI ----------
  return (
    <div
      className="space-y-8 px-6 py-8 min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #0A0F2D, #1F2A6C)",
        color: "white",
        fontFamily: "'Inter', 'SF Pro Display', sans-serif",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white"
      >
        NRI Banking Assistant
      </motion.h1>

      {/* Voice Assistant Card */}
      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Voice Assistant</CardTitle>
          <CardDescription className="text-white/60">
            Try: “Transfer 1200 dollars to India” or “Send ₹5000 to US”
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* editable input so you can test & debug */}
          <div className="relative">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Speak or type your command here..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40"
            />
            {isListening && (
              <div className="absolute right-3 top-3 h-6 w-6 animate-pulse rounded-full bg-red-500" />
            )}
          </div>

          {/* Debug preview */}
          {command && (
            <div className="rounded-md border border-white/10 bg-black/30 p-3 text-sm text-white/70">
              <p className="mb-1 font-semibold text-[#00FFC6]"></p>
              {(() => {
                const text = command
                  .toLowerCase()
                  .replace(
                    /into|in|to\s+my|account|bank|manager|project/gi,
                    "to"
                  )
                  .replace(/\$/g, "dollar ")
                  .replace(/₹/g, "rupee ")
                  .replace(/usd|dollars?/gi, "dollar")
                  .replace(/inr|rupees?/gi, "rupee")
                  .replace(/(rupee|dollar)(?=\d)/g, "$1 ")
                  .replace(/\s+/g, " ")
                  .trim();

                const regex =
                  /(transfer|send|move|pay)\s+(?:dollar\s*|rupee\s*|[$₹]\s*)?([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]+)?|[0-9]+(?:[.,][0-9]+)?)(?:\s*(?:dollar|rupee))?\s*(?:to|into)?\s*(india|us|hdfc|chase)?/i;

                const match = text.match(regex);
                if (!match) return;

                const amount = match[2];
                const destination = match[3] || "N/A";
                const currency = text.includes("rupee")
                  ? "INR"
                  : text.includes("dollar")
                  ? "USD"
                  : "Unknown";

                return (
                  <>
                    <p>
                      <strong>Detected Amount:</strong> {amount}
                    </p>
                    <p>
                      <strong>Detected Currency:</strong> {currency}
                    </p>
                    <p>
                      <strong>Destination:</strong> {destination.toUpperCase()}
                    </p>
                  </>
                );
              })()}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() =>
                isListening ? stopVoiceRecognition() : startVoiceRecognition()
              }
              className={`flex-1 gap-2 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#00FFC6] text-black hover:bg-[#00FFB3]"
              }`}
            >
              <Mic className="h-4 w-4" />
              {isListening ? "Listening..." : "Start Speaking"}
            </Button>

            <Button
              onClick={() => handleVoiceCommand(command)}
              disabled={!command.trim()}
              className="gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Enter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts */}
      <div className="grid gap-6 md:grid-cols-2">
        <AnimatedAccount
          title="Chase Bank (US)"
          balance={usBalance}
          currency="USD"
          gradientFrom="#FF6B35"
          gradientTo="#D83533"
          highlight={highlight === "us"}
        />
        <AnimatedAccount
          title="HDFC Bank (India)"
          balance={indiaBalance}
          currency="INR"
          gradientFrom="#1E40AF"
          gradientTo="#1E3A8A"
          highlight={highlight === "india"}
        />
      </div>

      {/* Exchange Rate Info */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#00FFC6]" />
          <span className="text-white/80">Exchange Rate</span>
        </div>
        <div className="text-lg font-bold text-[#00FFC6]">
          1 USD = ₹{EXCHANGE_RATE.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// ---------- AnimatedAccount Component ----------
function AnimatedAccount({
  title,
  balance,
  currency,
  gradientFrom,
  gradientTo,
  highlight,
}: {
  title: string;
  balance: number;
  currency: string;
  gradientFrom: string;
  gradientTo: string;
  highlight: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
          <CardDescription className="text-white/60">
            {currency}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div
            className="rounded-lg p-6 text-white"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            }}
          >
            <div className="mb-4 text-sm opacity-90">Account Balance</div>
            <div className="mb-2 text-3xl font-bold tracking-wider">
              {currency === "USD"
                ? `$${balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : `₹${balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </div>
          </div>

          <div className="mt-4">
            <AnimatePresence>
              {highlight && (
                <motion.div
                  key="hl"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="p-3 rounded-md bg-white/6 text-sm text-white/90">
                    <strong>Account Updated</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
