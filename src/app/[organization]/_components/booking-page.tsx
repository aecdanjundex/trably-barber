"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/utils";
import { useCustomerSession } from "../_hooks/use-customer-session";
import { AuthScreen } from "./auth-screen";
import { OtpScreen } from "./otp-screen";
import { OnboardingScreen } from "./onboarding-screen";
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

  const trpc = useTRPC();
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery({
    ...trpc.customerAuth.getProfile.queryOptions(),
    enabled: !!session,
  });

  if (loading || (session && profileLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (session && profile?.needsOnboarding) {
    return (
      <OnboardingScreen
        org={org}
        onComplete={() => {
          refetchProfile();
        }}
      />
    );
  }

  if (session) {
    return (
      <BookingScreen
        org={org}
        onSignOut={clearSession}
        customerName={profile?.name ?? undefined}
      />
    );
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
