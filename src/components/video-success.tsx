"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Use React Router instead of next/link

interface VerificationSuccessProps {
  verificationId: string | null;
}

export default function VerificationSuccess({
  verificationId,
}: VerificationSuccessProps): JSX.Element {
  return (
    <div className="w-full max-w-md">
      <Card className="p-6 space-y-6 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 animate-pulse" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Verification Complete!</h1>
          <p className="text-muted-foreground">
            Your identity has been successfully verified.
          </p>
        </div>

        {/* Verification ID */}
        {verificationId && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Verification ID:
            </p>
            <p className="font-mono text-sm break-all">{verificationId}</p>
          </div>
        )}

        {/* Info Section */}
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            This verification has been recorded and can be referenced for
            security purposes.
          </p>
        </div>

        {/* Navigation Button */}
        <Link to="/app" className="block">
          <Button className="w-full">Continue to FinCognia</Button>
        </Link>
      </Card>
    </div>
  );
}
