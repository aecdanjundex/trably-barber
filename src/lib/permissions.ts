import { adminAc, userAc, defaultAc } from "better-auth/plugins/admin/access";

export { adminAc, userAc, defaultAc };

export const ORG_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  STAFF: "staff",
} as const;

export type OrgRole = (typeof ORG_ROLES)[keyof typeof ORG_ROLES];

export const ORG_ADMIN_ROLES: OrgRole[] = [ORG_ROLES.OWNER, ORG_ROLES.ADMIN];
