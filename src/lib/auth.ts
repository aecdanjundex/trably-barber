import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "user",
    }),
    organization({
      /**
       * Member roles inside an organization (barbearia):
       *   owner  — created automatically for the org creator; full control
       *   admin  — manages barbers, schedule, settings
       *   barber — can view/manage their own agenda
       *
       * Customers are NOT Better Auth users — they live in the `customer` table.
       */
      memberRoles: ["owner", "admin", "barber"],
    }),
  ],
});
