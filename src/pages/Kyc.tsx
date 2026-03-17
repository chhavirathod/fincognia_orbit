"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, Video, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type KYCStage = "upload" | "verification" | "qr" | "success";

interface DocumentUpload {
  aadhaar: File | null;
  pan: File | null;
  aadhaarPreview: string | null;
  panPreview: string | null;
}

export default function KYCPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<KYCStage>("upload");
  const [showNRIAssistant, setShowNRIAssistant] = useState(false);
  const [documents, setDocuments] = useState<DocumentUpload>({
    aadhaar: null,
    pan: null,
    aadhaarPreview: null,
    panPreview: null,
  });
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDocumentUpload = (type: "aadhaar" | "pan", file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDocuments((prev) => ({
        ...prev,
        [type]: file,
        [`${type}Preview`]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const canProceedToVideo =
    documents.aadhaar !== null || documents.pan !== null;

  const startVideoVerification = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setVideoStream(stream);
      setIsVideoActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStage("verification");
    } catch (error) {
      console.error("Failed to access camera:", error);
    }
  };

  const captureAndContinue = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0);
      }
    }

    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
      setIsVideoActive(false);
    }

    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      setStage("qr");
    }, 2500);
  };

  const handleSuccess = () => {
    setStage("success");
  };

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F2D] via-[#1a1f4d] to-[#1F2A6C] overflow-hidden">
      {/* Subtle accent background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#00FFC6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00FFC6]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            KYC Verification
          </h1>
          <p className="text-gray-300">Complete your identity verification</p>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              {/* Document Upload Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Aadhaar Card */}
                <DocumentUploadCard
                  title="Aadhaar Card"
                  subtitle="PDF, JPG, or PNG"
                  preview={documents.aadhaarPreview}
                  hasFile={documents.aadhaar !== null}
                  onUpload={(file) => handleDocumentUpload("aadhaar", file)}
                  onRemove={() =>
                    setDocuments((prev) => ({
                      ...prev,
                      aadhaar: null,
                      aadhaarPreview: null,
                    }))
                  }
                />

                {/* PAN Card */}
                <DocumentUploadCard
                  title="PAN Card"
                  subtitle="PDF, JPG, or PNG"
                  preview={documents.panPreview}
                  hasFile={documents.pan !== null}
                  onUpload={(file) => handleDocumentUpload("pan", file)}
                  onRemove={() =>
                    setDocuments((prev) => ({
                      ...prev,
                      pan: null,
                      panPreview: null,
                    }))
                  }
                />
              </div>

              {/* Proceed Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <Button
                  onClick={() => navigate("/kyc/video")}
                  disabled={!canProceedToVideo}
                  className="px-8 py-3 bg-[#00FFC6] text-[#0A0F2D] hover:bg-[#00FFB3] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Verification
                </Button>
              </motion.div>
            </motion.div>
          )}

          {stage === "verification" && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <div className="space-y-6">
                {/* Video Feed */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#00FFC6]/30 bg-black/40 p-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Teal Glowing Frame */}
                    <div className="absolute inset-0 border-2 border-[#00FFC6]/50 rounded-lg shadow-[0_0_20px_rgba(0,255,198,0.3)] pointer-events-none" />

                    {/* Instruction Overlay */}
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="text-center px-4">
                        <p className="text-white font-semibold text-lg drop-shadow-lg">
                          Please look into the camera for face verification
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Canvas for capture (hidden) */}
                <canvas
                  ref={canvasRef}
                  className="hidden"
                  width={640}
                  height={480}
                />

                {/* Capture Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={captureAndContinue}
                    className="px-8 py-3 bg-[#00FFC6] text-[#0A0F2D] hover:bg-[#00FFB3] font-semibold rounded-lg transition-all duration-300"
                  >
                    Capture & Continue
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {stage === "qr" && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="glassmorphic-card space-y-6 p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
                {/* Linking State */}
                {isLinking && (
                  <div className="space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-16 h-16 mx-auto"
                    >
                      <div className="w-full h-full rounded-full border-4 border-[#00FFC6]/20 border-t-[#00FFC6]" />
                    </motion.div>
                    <p className="text-center text-white font-semibold">
                      Linking Aadhaar…
                    </p>
                  </div>
                )}

                {/* QR Code Section */}
                {!isLinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Mock QR Code */}
                    <div className="flex justify-center">
                      <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-lg">
                        <MockQRCode />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="text-center space-y-2">
                      <p className="text-white font-semibold">
                        Scan this QR on your mobile
                      </p>
                      <p className="text-gray-300 text-sm">
                        linked to Aadhaar to confirm your KYC
                      </p>
                    </div>

                    {/* Done Button */}
                    <Button
                      onClick={handleSuccess}
                      className="w-full px-8 py-3 bg-[#00FFC6] text-[#0A0F2D] hover:bg-[#00FFB3] font-semibold rounded-lg transition-all duration-300"
                    >
                      Done
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {stage === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="mb-6"
              >
                <CheckCircle className="w-24 h-24 text-[#00FFC6] mx-auto" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <h2 className="text-3xl font-bold text-white">
                  KYC Verified Successfully!
                </h2>
                <p className="text-gray-300">
                  Your identity has been confirmed. You can now access all
                  features.
                </p>

                <div className="pt-4">
                  <Button className="px-8 py-3 bg-[#00FFC6] text-[#0A0F2D] hover:bg-[#00FFB3] font-semibold rounded-lg transition-all duration-300">
                    Continue to Dashboard
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Avatar Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8 z-20"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FFC6]/30 to-[#00FFC6]/10 border border-[#00FFC6]/50 flex items-center justify-center backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-[#00FFC6]/20 flex items-center justify-center">
            <span className="text-lg font-bold text-[#00FFC6]">F</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface DocumentUploadCardProps {
  title: string;
  subtitle: string;
  preview: string | null;
  hasFile: boolean;
  onUpload: (file: File | null) => void;
  onRemove: () => void;
}

function DocumentUploadCard({
  title,
  subtitle,
  preview,
  hasFile,
  onUpload,
  onRemove,
}: DocumentUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="group relative">
        {/* Card Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC6]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Card Content */}
        <div className="relative rounded-2xl border border-[#00FFC6]/20 bg-white/5 backdrop-blur-sm p-6 hover:border-[#00FFC6]/40 transition-all duration-300 cursor-pointer">
          {preview && hasFile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/20 border border-[#00FFC6]/30">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">File uploaded</span>
                <button
                  onClick={onRemove}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ) : (
            <label
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center py-8 cursor-pointer"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Upload className="w-10 h-10 text-[#00FFC6] mb-3" />
              </motion.div>
              <p className="font-semibold text-white mb-1">{title}</p>
              <p className="text-sm text-gray-400">{subtitle}</p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => onUpload(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MockQRCode() {
  const qrPattern = Array.from({ length: 21 }, () =>
    Array.from({ length: 21 }, () => Math.random() > 0.5)
  );

  return (
    <div className="grid grid-cols-[repeat(21,1fr)] gap-0.5">
      {qrPattern.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={`w-1 h-1 rounded-sm ${cell ? "bg-black" : "bg-white"}`}
          />
        ))
      )}
    </div>
  );
}
