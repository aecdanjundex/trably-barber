import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";

// ─── Better Auth tables ──────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: text("active_organization_id"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ─── Multi-tenant org tables ─────────────────────────────────────────────────

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  /** Service provider type: "salon" | "clinic" | "auto" | "cleaning" | "other" */
  type: text("type").notNull().default("other"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
  plan: text("plan").notNull().default("free"),
  planInterval: text("plan_interval"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  trialEndsAt: timestamp("trial_ends_at"),
  currentPeriodStartsAt: timestamp("current_period_starts_at"),
  currentPeriodEndsAt: timestamp("current_period_ends_at"),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  /** "owner" | "admin" | "staff" */
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Client domain ───────────────────────────────────────────────────────────

export const client = pgTable(
  "client",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    document: text("document"),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    /** "lead" | "active" | "inactive" */
    status: text("status").notNull().default("active"),
    /** How the client was acquired: "referral" | "social" | "walk_in" | "website" | "other" */
    source: text("source"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [index("client_org_idx").on(t.organizationId)],
);

export const clientTag = pgTable(
  "client_tag",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull().default("#6366f1"),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [unique("client_tag_org_name_unique").on(t.organizationId, t.name)],
);

export const clientTagAssignment = pgTable(
  "client_tag_assignment",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => clientTag.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [
    unique("client_tag_assignment_unique").on(t.clientId, t.tagId),
    index("client_tag_assignment_client_idx").on(t.clientId),
  ],
);

export const clientNote = pgTable(
  "client_note",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    /** "note" | "call" | "email" | "meeting" | "activity" */
    type: text("type").notNull().default("note"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [index("client_note_client_idx").on(t.clientId)],
);

// ─── Service catalog ─────────────────────────────────────────────────────────

export const serviceCategory = pgTable(
  "service_category",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [
    unique("service_category_org_name_unique").on(t.organizationId, t.name),
  ],
);

export const service = pgTable("service", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => serviceCategory.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes"),
  priceInCents: integer("price_in_cents").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const product = pgTable("product", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: text("sku"),
  priceInCents: integer("price_in_cents").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const paymentMethod = pgTable("payment_method", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  /** "cash" | "credit" | "debit" | "pix" | "transfer" | "other" */
  type: text("type").notNull().default("other"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// ─── Service Order domain ────────────────────────────────────────────────────

export const serviceOrder = pgTable(
  "service_order",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    number: integer("number").notNull(),
    clientId: text("client_id").references(() => client.id, {
      onDelete: "set null",
    }),
    assignedToId: text("assigned_to_id").references(() => user.id, {
      onDelete: "set null",
    }),
    /** "open" | "in_progress" | "completed" | "cancelled" */
    status: text("status").notNull().default("open"),
    /** Discount in cents */
    discountInCents: integer("discount_in_cents").notNull().default(0),
    dueDate: timestamp("due_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [
    index("service_order_org_idx").on(t.organizationId),
    index("service_order_client_idx").on(t.clientId),
    unique("service_order_org_number_unique").on(t.organizationId, t.number),
  ],
);

export const serviceOrderItem = pgTable(
  "service_order_item",
  {
    id: text("id").primaryKey(),
    serviceOrderId: text("service_order_id")
      .notNull()
      .references(() => serviceOrder.id, { onDelete: "cascade" }),
    /** "service" | "product" */
    itemType: text("item_type").notNull(),
    referenceId: text("reference_id"),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPriceInCents: integer("unit_price_in_cents").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [index("service_order_item_order_idx").on(t.serviceOrderId)],
);

export const serviceOrderPayment = pgTable(
  "service_order_payment",
  {
    id: text("id").primaryKey(),
    serviceOrderId: text("service_order_id")
      .notNull()
      .references(() => serviceOrder.id, { onDelete: "cascade" }),
    paymentMethodId: text("payment_method_id")
      .notNull()
      .references(() => paymentMethod.id, { onDelete: "cascade" }),
    amountInCents: integer("amount_in_cents").notNull(),
    paidAt: timestamp("paid_at").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [
    index("service_order_payment_order_idx").on(t.serviceOrderId),
    index("service_order_payment_method_idx").on(t.paymentMethodId),
  ],
);

// ─── Financial domain ────────────────────────────────────────────────────────

export const expense = pgTable(
  "expense",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** "rent" | "supplies" | "payroll" | "marketing" | "utilities" | "other" */
    category: text("category").notNull().default("other"),
    description: text("description").notNull(),
    amountInCents: integer("amount_in_cents").notNull(),
    date: timestamp("date").notNull(),
    createdById: text("created_by_id").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [index("expense_org_idx").on(t.organizationId)],
);
