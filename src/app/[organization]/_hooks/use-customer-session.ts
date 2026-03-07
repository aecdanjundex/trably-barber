"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "customer-session";

interface CustomerSession {
  token: string;
  customerId: string;
  /** Org slug — ensures the stored session belongs to the current tenant */
  slug: string;
}

export function useCustomerSession(slug: string) {
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CustomerSession;
        if (parsed.slug === slug && parsed.token) {
          setSession(parsed);
        }
      }
    } catch {
      // Corrupted storage — ignore
    }
    setLoading(false);
  }, [slug]);

  function saveSession(token: string, customerId: string) {
    const data: CustomerSession = { token, customerId, slug };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  return { session, loading, saveSession, clearSession };
}
