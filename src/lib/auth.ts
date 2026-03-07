import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  ownerAc,
  adminAc,
  memberAc,
} from "better-auth/plugins/organization/access";
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
      roles: {
        owner: ownerAc,
        admin: adminAc,
        member: memberAc,
        barber: memberAc,
      },
      async sendInvitationEmail({ email, organization, id }) {
        const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
        const inviteUrl = `${baseUrl}/admin/convite?id=${id}`;

        console.log("\n" + "=".repeat(60));
        console.log("📧 CONVITE DE ORGANIZAÇÃO");
        console.log("=".repeat(60));
        console.log(`Para: ${email}`);
        console.log(`Barbearia: ${organization.name}`);
        console.log(`Link: ${inviteUrl}`);
        console.log("=".repeat(60) + "\n");
      },
    }),
  ],
});
