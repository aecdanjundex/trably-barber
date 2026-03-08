"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { TRPCProvider } from "./utils";
import type { AppRouter } from "./router";
import superjson from "superjson";
import { makeQueryClient } from "./query-client";
import { clientEnv } from "@/lib/env/client";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return clientEnv.NEXT_PUBLIC_APP_URL;
}

function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("customer-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

let browserQueryClient: ReturnType<typeof makeQueryClient> | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getBaseUrl() + "/api/trpc",
          headers() {
            const token = getCustomerToken();
            return token ? { "x-customer-token": token } : {};
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
