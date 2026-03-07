import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { clientEnv } from "@/lib/env/client";

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
  plugins: [adminClient(), organizationClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
