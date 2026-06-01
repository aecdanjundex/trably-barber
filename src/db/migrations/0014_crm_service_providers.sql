-- CRM for Service Providers migration
-- Adds: client, client_tag, client_tag_assignment, client_note,
--       service_category, expense
-- Updates: organization (adds type), service_order (adds number, assignedToId, discountInCents),
--           service (adds categoryId), product (adds sku), payment_method (adds type)

ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "type" text NOT NULL DEFAULT 'other';

-- Client tables
CREATE TABLE IF NOT EXISTS "client" (
  "id" text PRIMARY KEY,
  "organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "email" text,
  "phone" text,
  "document" text,
  "address" text,
  "city" text,
  "state" text,
  "status" text NOT NULL DEFAULT 'active',
  "source" text,
  "notes" text,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS "client_org_idx" ON "client"("organization_id");

CREATE TABLE IF NOT EXISTS "client_tag" (
  "id" text PRIMARY KEY,
  "organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "color" text NOT NULL DEFAULT '#6366f1',
  "created_at" timestamp NOT NULL,
  CONSTRAINT "client_tag_org_name_unique" UNIQUE ("organization_id", "name")
);

CREATE TABLE IF NOT EXISTS "client_tag_assignment" (
  "id" text PRIMARY KEY,
  "client_id" text NOT NULL REFERENCES "client"("id") ON DELETE CASCADE,
  "tag_id" text NOT NULL REFERENCES "client_tag"("id") ON DELETE CASCADE,
  "created_at" timestamp NOT NULL,
  CONSTRAINT "client_tag_assignment_unique" UNIQUE ("client_id", "tag_id")
);
CREATE INDEX IF NOT EXISTS "client_tag_assignment_client_idx" ON "client_tag_assignment"("client_id");

CREATE TABLE IF NOT EXISTS "client_note" (
  "id" text PRIMARY KEY,
  "client_id" text NOT NULL REFERENCES "client"("id") ON DELETE CASCADE,
  "organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "author_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "content" text NOT NULL,
  "type" text NOT NULL DEFAULT 'note',
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS "client_note_client_idx" ON "client_note"("client_id");

-- Service category
CREATE TABLE IF NOT EXISTS "service_category" (
  "id" text PRIMARY KEY,
  "organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "created_at" timestamp NOT NULL,
  CONSTRAINT "service_category_org_name_unique" UNIQUE ("organization_id", "name")
);

-- Update service table
ALTER TABLE "service" ADD COLUMN IF NOT EXISTS "category_id" text REFERENCES "service_category"("id") ON DELETE SET NULL;

-- Update product table
ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "sku" text;

-- Update payment_method table
ALTER TABLE "payment_method" ADD COLUMN IF NOT EXISTS "type" text NOT NULL DEFAULT 'other';

-- Create new service_order table (replacing old one)
-- Note: the old service_order table must be migrated. Here we add missing columns.
ALTER TABLE "service_order" ADD COLUMN IF NOT EXISTS "number" integer;
ALTER TABLE "service_order" ADD COLUMN IF NOT EXISTS "assigned_to_id" text REFERENCES "user"("id") ON DELETE SET NULL;
ALTER TABLE "service_order" ADD COLUMN IF NOT EXISTS "discount_in_cents" integer NOT NULL DEFAULT 0;
ALTER TABLE "service_order" ADD COLUMN IF NOT EXISTS "due_date" timestamp;

-- Set default number for existing orders
UPDATE "service_order" SET "number" = 1 WHERE "number" IS NULL;
ALTER TABLE "service_order" ALTER COLUMN "number" SET NOT NULL;

-- Unique constraint for service_order number per org
ALTER TABLE "service_order" DROP CONSTRAINT IF EXISTS "service_order_org_number_unique";
ALTER TABLE "service_order" ADD CONSTRAINT "service_order_org_number_unique" UNIQUE ("organization_id", "number");

-- Expense table
CREATE TABLE IF NOT EXISTS "expense" (
  "id" text PRIMARY KEY,
  "organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "category" text NOT NULL DEFAULT 'other',
  "description" text NOT NULL,
  "amount_in_cents" integer NOT NULL,
  "date" timestamp NOT NULL,
  "created_by_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS "expense_org_idx" ON "expense"("organization_id");
