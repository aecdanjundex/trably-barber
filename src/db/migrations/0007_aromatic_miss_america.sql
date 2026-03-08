CREATE TABLE "commission_payment" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"professional_id" text NOT NULL,
	"period_from" timestamp NOT NULL,
	"period_to" timestamp NOT NULL,
	"total_commission_in_cents" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commission_payment_item" (
	"id" text PRIMARY KEY NOT NULL,
	"commission_payment_id" text NOT NULL,
	"service_order_item_id" text,
	"reference_type" text NOT NULL,
	"reference_id" text,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_in_cents" integer NOT NULL,
	"commission_type" text NOT NULL,
	"fixed_value_in_cents" integer,
	"percentage_value" integer,
	"commission_amount_in_cents" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "plan_interval" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "subscription_status" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "trial_ends_at" timestamp;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "current_period_ends_at" timestamp;--> statement-breakpoint
ALTER TABLE "commission_payment" ADD CONSTRAINT "commission_payment_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_payment" ADD CONSTRAINT "commission_payment_professional_id_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_payment_item" ADD CONSTRAINT "commission_payment_item_commission_payment_id_commission_payment_id_fk" FOREIGN KEY ("commission_payment_id") REFERENCES "public"."commission_payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_payment_item" ADD CONSTRAINT "commission_payment_item_service_order_item_id_service_order_item_id_fk" FOREIGN KEY ("service_order_item_id") REFERENCES "public"."service_order_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "commission_payment_org_idx" ON "commission_payment" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "commission_payment_professional_idx" ON "commission_payment" USING btree ("professional_id");--> statement-breakpoint
CREATE INDEX "commission_payment_item_payment_idx" ON "commission_payment_item" USING btree ("commission_payment_id");