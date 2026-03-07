import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import {
  ownerAc,
  adminAc,
  memberAc,
} from "better-auth/plugins/organization/access";
import { clientEnv } from "@/lib/env/client";

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient(),
    organizationClient({
      roles: {
        owner: ownerAc,
        admin: adminAc,
        member: memberAc,
        barber: memberAc,
      },
    }),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
