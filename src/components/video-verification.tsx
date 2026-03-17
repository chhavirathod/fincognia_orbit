"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Video } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface VideoVerificationProps {
  onVerificationComplete: (verificationId: string) => void;
}

export default function VideoVerification({
  onVerificationComplete,
}: VideoVerificationProps) {
  const [step, setStep] = useState<"idle" | "scanning" | "generating" | "qr">(
    "idle"
  );
  const [scanProgress, setScanProgress] = useState(0);
  const [verificationLink, setVerificationLink] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start video scanning for 20 seconds
  const startVideoScanning = async () => {
    setStep("scanning");
    setScanProgress(0);

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulate 20-second scan with progress
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 100;
        setScanProgress(Math.min((elapsed / 20000) * 100, 100));

        // When 20 seconds are complete
        if (elapsed >= 20000) {
          clearInterval(interval);
          stopVideoStream();
          generateQRCode();
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
      setStep("idle");
    }
  };

  // Stop video stream
  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Generate QR code after scan completes
  const generateQRCode = () => {
    setStep("generating");

    // Simulate QR code generation with slight delay
    setTimeout(() => {
      // Generate a unique verification ID
      const verificationId = `VER-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      // Create a verification link (in real app, this would be a backend URL)
      const link = `${window.location.origin}?verify=${verificationId}`;
      setVerificationLink(link);
      setStep("qr");
    }, 1500);
  };

  // Handle QR code click to complete verification
  const handleQRCodeClick = () => {
    const verificationId =
      new URLSearchParams(verificationLink.split("?")[1]).get("verify") || "";
    onVerificationComplete(verificationId);
  };

  return (
    <div className="w-full max-w-md">
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Video Verification</h1>
          <p className="text-muted-foreground">
            {step === "idle" && "Click start to begin your video verification"}
            {step === "scanning" && "Scanning... Keep still for 20 seconds"}
            {step === "generating" && "Generating verification code..."}
            {step === "qr" && "Scan the QR code to complete verification"}
          </p>
        </div>

        {/* Video Display */}
        {step === "scanning" && (
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Scanner overlay */}
              <div className="absolute inset-0 border-4 border-dashed border-primary/50 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-primary rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning in progress: {Math.round(scanProgress)}%
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Generating State */}
        {step === "generating" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Processing your verification...
            </p>
          </div>
        )}

        {/* QR Code Display */}
        {step === "qr" && verificationLink && (
          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Click the QR code below to complete your verification:
            </p>
            <div className="flex justify-center">
              <div
                onClick={handleQRCodeClick}
                className="p-4 bg-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              >
                <QRCodeSVG
                  value={verificationLink}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground break-all">
              {verificationLink}
            </p>
          </div>
        )}

        {/* Button */}
        <Button
          onClick={startVideoScanning}
          disabled={step !== "idle"}
          className="w-full"
          size="lg"
        >
          {step === "idle" ? (
            <>
              <Video className="w-4 h-4 mr-2" />
              Start Video Verification
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {step === "scanning" && "Scanning..."}
              {step === "generating" && "Generating QR Code..."}
              {step === "qr" && "Click QR Code to Verify"}
            </>
          )}
        </Button>
      </Card>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        <p className="text-xs font-semibold mb-2">How it works:</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>Grant camera access when prompted</li>
          <li>Hold still for 20 seconds while scanning</li>
          <li>A QR code will be generated</li>
          <li>Click the QR code to complete verification</li>
        </ul>
      </div>
    </div>
  );
}
