import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

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

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
  plan: text("plan").notNull().default("free"),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
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

// ─── Application domain ──────────────────────────────────────────────────────

/**
 * Customers belong to a specific organization (barbearia).
 * They are NOT Better Auth users — they authenticate via phone + OTP.
 * A customer is unique per organization (same phone can exist in different orgs).
 */
export const customer = pgTable(
  "customer",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    notes: text("notes"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [unique("customer_org_phone_unique").on(t.organizationId, t.phone)],
);

/**
 * Temporary OTP codes for customer login.
 * One pending OTP per (organizationId, phone) at a time.
 */
export const customerOtp = pgTable("customer_otp", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  phone: text("phone").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

/**
 * Customer sessions created after successful OTP verification.
 */
export const customerSession = pgTable("customer_session", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

/**
 * Services offered by a barbershop (e.g. haircut, beard trim).
 * Each service belongs to a specific organization.
 */
export const service = pgTable("service", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  /** Duration in minutes */
  durationMinutes: integer("duration_minutes").notNull(),
  /** Price in cents (BRL) */
  priceInCents: integer("price_in_cents").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/**
 * Appointments / bookings made by customers.
 */
export const appointment = pgTable("appointment", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  customerId: text("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  /** The barber (member user) assigned to this appointment */
  barberId: text("barber_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  serviceId: text("service_id")
    .notNull()
    .references(() => service.id, { onDelete: "cascade" }),
  /** Scheduled start time */
  startsAt: timestamp("starts_at").notNull(),
  /** Scheduled end time */
  endsAt: timestamp("ends_at").notNull(),
  status: text("status").notNull().default("scheduled"),
  /** "regular" | "squeeze_in" */
  type: text("type").notNull().default("regular"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// ─── Scheduling domain ───────────────────────────────────────────────────────

/**
 * Schedule configuration per barber per day of week.
 * Defines working hours and slot intervals.
 */
export const scheduleConfig = pgTable(
  "schedule_config",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    barberId: text("barber_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** 0 = Sunday, 1 = Monday, …, 6 = Saturday */
    dayOfWeek: integer("day_of_week").notNull(),
    /** Working hours start, e.g. "08:00" */
    startTime: text("start_time").notNull(),
    /** Working hours end (closing time), e.g. "18:00" */
    endTime: text("end_time").notNull(),
    /** Minutes between appointment slot starts */
    slotIntervalMinutes: integer("slot_interval_minutes").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [
    unique("schedule_config_barber_day_unique").on(t.barberId, t.dayOfWeek),
  ],
);

/**
 * Barber time blocks — date/time ranges where the barber is unavailable.
 */
export const barberTimeBlock = pgTable(
  "barber_time_block",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    barberId: text("barber_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [index("barber_time_block_barber_idx").on(t.barberId)],
);

/**
 * Customer blocks — prevent a specific customer from booking with a barber
 * on a certain day of week or specific date. Hidden from the customer.
 */
export const customerBlock = pgTable(
  "customer_block",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    barberId: text("barber_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    customerId: text("customer_id")
      .notNull()
      .references(() => customer.id, { onDelete: "cascade" }),
    /** Recurring block on a day of week (0–6), or null */
    dayOfWeek: integer("day_of_week"),
    /** Specific date block as "YYYY-MM-DD", or null */
    blockedDate: text("blocked_date"),
    reason: text("reason"),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [
    index("customer_block_barber_customer_idx").on(t.barberId, t.customerId),
  ],
);

// ─── Service Order domain ────────────────────────────────────────────────────

/**
 * Products offered by the barbershop (e.g. hair gel, shampoo).
 */
export const product = pgTable("product", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  /** Price in cents (BRL) */
  priceInCents: integer("price_in_cents").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/**
 * Payment methods registered per organization (e.g. Espécie, Cartão de Crédito, Débito, Pix).
 */
export const paymentMethod = pgTable("payment_method", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/**
 * Commission rules per professional per service/product.
 * Defines how much a barber earns for a specific service or product.
 * The commission can be a fixed value (in cents) or a percentage.
 */
export const commissionConfig = pgTable(
  "commission_config",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** The professional (member/barber) */
    professionalId: text("professional_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** "service" | "product" */
    referenceType: text("reference_type").notNull(),
    /** ID of the service or product */
    referenceId: text("reference_id").notNull(),
    /** "fixed" | "percentage" */
    commissionType: text("commission_type").notNull(),
    /** Fixed value in cents (when type = "fixed") */
    fixedValueInCents: integer("fixed_value_in_cents"),
    /** Percentage value, stored as integer (e.g. 10 = 10%, 1050 = 10.50% when using basis points).
     *  We store as percentage * 100 (basis points) for precision: 1000 = 10.00% */
    percentageValue: integer("percentage_value"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [
    unique("commission_config_professional_ref_unique").on(
      t.professionalId,
      t.referenceType,
      t.referenceId,
    ),
    index("commission_config_org_idx").on(t.organizationId),
  ],
);

/**
 * Service orders — the main invoice/order for a client visit.
 */
export const serviceOrder = pgTable(
  "service_order",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    customerId: text("customer_id").references(() => customer.id, {
      onDelete: "set null",
    }),
    /** "open" | "completed" | "cancelled" */
    status: text("status").notNull().default("open"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [
    index("service_order_org_idx").on(t.organizationId),
    index("service_order_customer_idx").on(t.customerId),
  ],
);

/**
 * Items within a service order (services and products).
 * Prices are stored at item level to preserve historical values.
 */
export const serviceOrderItem = pgTable(
  "service_order_item",
  {
    id: text("id").primaryKey(),
    serviceOrderId: text("service_order_id")
      .notNull()
      .references(() => serviceOrder.id, { onDelete: "cascade" }),
    /** "service" | "product" */
    itemType: text("item_type").notNull(),
    /** Original service or product ID (for reference, nullable if deleted) */
    referenceId: text("reference_id"),
    /** Snapshot of name at the time of creation */
    name: text("name").notNull(),
    quantity: integer("quantity").notNull().default(1),
    /** Snapshot of unit price in cents at the time of creation */
    unitPriceInCents: integer("unit_price_in_cents").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [index("service_order_item_order_idx").on(t.serviceOrderId)],
);

/**
 * Associates professionals with service order items.
 * Commission values are stored at this level for historical accuracy.
 */
export const serviceOrderItemProfessional = pgTable(
  "service_order_item_professional",
  {
    id: text("id").primaryKey(),
    serviceOrderItemId: text("service_order_item_id")
      .notNull()
      .references(() => serviceOrderItem.id, { onDelete: "cascade" }),
    /** The professional who executed this item */
    professionalId: text("professional_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** "fixed" | "percentage" */
    commissionType: text("commission_type").notNull(),
    /** Snapshot of fixed commission in cents */
    fixedValueInCents: integer("fixed_value_in_cents"),
    /** Snapshot of percentage value (basis points: 1000 = 10.00%) */
    percentageValue: integer("percentage_value"),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [
    index("so_item_professional_item_idx").on(t.serviceOrderItemId),
    index("so_item_professional_user_idx").on(t.professionalId),
  ],
);

/**
 * Payments received for a service order.
 * Tracked separately from the order total — the order total (invoiced)
 * is the sum of items, while payments (received) are actual money received.
 * Multiple payment methods can be used per order.
 */
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
    /** Amount received in cents */
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

/**
 * Quick items for fast addition to service orders.
 * References a service or product for one-click addition.
 */
export const quickItem = pgTable(
  "quick_item",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** "service" | "product" */
    itemType: text("item_type").notNull(),
    /** ID of the referenced service or product */
    referenceId: text("reference_id").notNull(),
    /** Display label (can differ from the original name) */
    label: text("label").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [index("quick_item_org_idx").on(t.organizationId)],
);

// ─── Commission Payments ─────────────────────────────────────────────────────

/**
 * Commission payment record for a professional in a given service period.
 * Generated from completed service orders within a date range.
 * Tracks all items the professional worked on and calculates total commission.
 */
export const commissionPayment = pgTable(
  "commission_payment",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    /** The professional receiving the commission */
    professionalId: text("professional_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Start of the service period */
    periodFrom: timestamp("period_from").notNull(),
    /** End of the service period */
    periodTo: timestamp("period_to").notNull(),
    /** Total commission amount in cents */
    totalCommissionInCents: integer("total_commission_in_cents").notNull(),
    /** "pending" | "paid" | "cancelled" */
    status: text("status").notNull().default("pending"),
    paidAt: timestamp("paid_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [
    index("commission_payment_org_idx").on(t.organizationId),
    index("commission_payment_professional_idx").on(t.professionalId),
  ],
);

/**
 * Line items within a commission payment.
 * Each item represents a service/product the professional worked on,
 * with the unit price, commission config snapshot, and calculated commission.
 */
export const commissionPaymentItem = pgTable(
  "commission_payment_item",
  {
    id: text("id").primaryKey(),
    commissionPaymentId: text("commission_payment_id")
      .notNull()
      .references(() => commissionPayment.id, { onDelete: "cascade" }),
    /** Reference to the original service order item */
    serviceOrderItemId: text("service_order_item_id").references(
      () => serviceOrderItem.id,
      { onDelete: "set null" },
    ),
    /** "service" | "product" */
    referenceType: text("reference_type").notNull(),
    /** Original service or product ID */
    referenceId: text("reference_id"),
    /** Snapshot of name */
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    /** Snapshot of unit price in cents */
    unitPriceInCents: integer("unit_price_in_cents").notNull(),
    /** "fixed" | "percentage" */
    commissionType: text("commission_type").notNull(),
    /** Fixed value in cents (when type = "fixed") */
    fixedValueInCents: integer("fixed_value_in_cents"),
    /** Percentage in basis points (1000 = 10.00%) */
    percentageValue: integer("percentage_value"),
    /** Calculated commission in cents for this line */
    commissionAmountInCents: integer("commission_amount_in_cents").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [
    index("commission_payment_item_payment_idx").on(t.commissionPaymentId),
  ],
);
