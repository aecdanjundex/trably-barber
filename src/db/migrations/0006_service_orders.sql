CREATE TABLE "commission_config" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"professional_id" text NOT NULL,
	"reference_type" text NOT NULL,
	"reference_id" text NOT NULL,
	"commission_type" text NOT NULL,
	"fixed_value_in_cents" integer,
	"percentage_value" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "commission_config_professional_ref_unique" UNIQUE("professional_id","reference_type","reference_id")
);
--> statement-breakpoint
CREATE TABLE "payment_method" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"price_in_cents" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quick_item" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"item_type" text NOT NULL,
	"reference_id" text NOT NULL,
	"label" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_order" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"customer_id" text,
	"status" text DEFAULT 'open' NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_order_item" (
	"id" text PRIMARY KEY NOT NULL,
	"service_order_id" text NOT NULL,
	"item_type" text NOT NULL,
	"reference_id" text,
	"name" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price_in_cents" integer NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_order_item_professional" (
	"id" text PRIMARY KEY NOT NULL,
	"service_order_item_id" text NOT NULL,
	"professional_id" text NOT NULL,
	"commission_type" text NOT NULL,
	"fixed_value_in_cents" integer,
	"percentage_value" integer,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_order_payment" (
	"id" text PRIMARY KEY NOT NULL,
	"service_order_id" text NOT NULL,
	"payment_method_id" text NOT NULL,
	"amount_in_cents" integer NOT NULL,
	"paid_at" timestamp NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commission_config" ADD CONSTRAINT "commission_config_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_config" ADD CONSTRAINT "commission_config_professional_id_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_method" ADD CONSTRAINT "payment_method_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quick_item" ADD CONSTRAINT "quick_item_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order" ADD CONSTRAINT "service_order_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order" ADD CONSTRAINT "service_order_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_item" ADD CONSTRAINT "service_order_item_service_order_id_service_order_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_item_professional" ADD CONSTRAINT "service_order_item_professional_service_order_item_id_service_order_item_id_fk" FOREIGN KEY ("service_order_item_id") REFERENCES "public"."service_order_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_item_professional" ADD CONSTRAINT "service_order_item_professional_professional_id_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_payment" ADD CONSTRAINT "service_order_payment_service_order_id_service_order_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_payment" ADD CONSTRAINT "service_order_payment_payment_method_id_payment_method_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_method"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "commission_config_org_idx" ON "commission_config" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "quick_item_org_idx" ON "quick_item" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "service_order_org_idx" ON "service_order" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "service_order_customer_idx" ON "service_order" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "service_order_item_order_idx" ON "service_order_item" USING btree ("service_order_id");--> statement-breakpoint
CREATE INDEX "so_item_professional_item_idx" ON "service_order_item_professional" USING btree ("service_order_item_id");--> statement-breakpoint
CREATE INDEX "so_item_professional_user_idx" ON "service_order_item_professional" USING btree ("professional_id");--> statement-breakpoint
CREATE INDEX "service_order_payment_order_idx" ON "service_order_payment" USING btree ("service_order_id");--> statement-breakpoint
CREATE INDEX "service_order_payment_method_idx" ON "service_order_payment" USING btree ("payment_method_id");