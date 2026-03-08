import { adminAc, userAc, defaultAc } from "better-auth/plugins/admin/access";

// Re-export the built-in admin access control roles for use in authorization checks
export { adminAc, userAc, defaultAc };

/**
 * Organization member roles.
 * Maps to the `role` column in the `member` table.
 */
export const ORG_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  BARBER: "barber",
} as const;

export type OrgRole = (typeof ORG_ROLES)[keyof typeof ORG_ROLES];

/** Roles that have management rights within an organization */
export const ORG_ADMIN_ROLES: OrgRole[] = [ORG_ROLES.OWNER, ORG_ROLES.ADMIN];

/**
 * Routes that a barber is allowed to access.
 * Barbers can only see their own appointments, commission payments, and commission reports.
 */
export const BARBER_ALLOWED_ROUTES = [
  "/admin/agendamentos",
  "/admin/pagamento-comissoes",
  "/admin/relatorios",
] as const;
