"use client";

import { useState } from "react";
import { useCustomerSession } from "../_hooks/use-customer-session";
import { AuthScreen } from "./auth-screen";
import { OtpScreen } from "./otp-screen";
import { BookingScreen } from "./booking-screen";

interface Org {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
}

type Step = "phone" | "otp";

export function BookingPage({ org }: { org: Org }) {
  const { session, loading, saveSession, clearSession } = useCustomerSession(
    org.slug ?? "",
  );
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (session) {
    return <BookingScreen org={org} onSignOut={clearSession} />;
  }

  if (step === "otp") {
    return (
      <OtpScreen
        org={org}
        phone={phone}
        onBack={() => setStep("phone")}
        onSuccess={(token, customerId) => saveSession(token, customerId)}
      />
    );
  }

  return (
    <AuthScreen
      org={org}
      onOtpSent={(sentPhone) => {
        setPhone(sentPhone);
        setStep("otp");
      }}
    />
  );
}
