"use client";

import { useState } from "react";
import VideoVerification from "@/components/video-verification";
import VerificationSuccess from "@/components/video-success";

export default function KycVideo(): JSX.Element {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const handleVerificationComplete = (id: string): void => {
    setVerificationId(id);
    setIsVerified(true);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      {!isVerified ? (
        <VideoVerification
          onVerificationComplete={handleVerificationComplete}
        />
      ) : (
        <VerificationSuccess verificationId={verificationId} />
      )}
    </main>
  );
}
