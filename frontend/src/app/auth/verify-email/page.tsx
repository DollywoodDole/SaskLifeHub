"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"pending" | "success" | "error" | "verifying">("pending");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      setStatus("verifying");
      authApi.verifyEmail(token)
        .then(() => { setStatus("success"); setTimeout(() => router.push("/dashboard"), 2000); })
        .catch(() => { setStatus("error"); setMessage("Verification link is invalid or expired."); });
    }
  }, [token, router]);

  async function handleResend() {
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setMessage("Verification email resent!");
    } catch {
      setMessage("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }

  if (status === "verifying") return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Verifying your email...</p>
    </div>
  );

  if (status === "success") return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8">
          <CheckCircle className="h-16 w-16 text-brand-green mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Email Verified!</h2>
          <p className="text-gray-500 mt-2">Redirecting to your dashboard...</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Mail className="h-14 w-14 text-brand-blue mx-auto mb-2" />
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && <p className="text-sm text-brand-green">{message}</p>}
          {status === "error" && <p className="text-sm text-red-600">{message}</p>}
          <Button variant="outline" className="w-full" onClick={handleResend} disabled={resending || !email}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {resending ? "Sending..." : "Resend Verification Email"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => router.push("/auth/login")}>
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
