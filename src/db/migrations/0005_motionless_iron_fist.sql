CREATE TABLE "barber_time_block" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"barber_id" text NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"reason" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_block" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"barber_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"day_of_week" integer,
	"blocked_date" text,
	"reason" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_config" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"barber_id" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"slot_interval_minutes" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "schedule_config_barber_day_unique" UNIQUE("barber_id","day_of_week")
);
--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "type" text DEFAULT 'regular' NOT NULL;--> statement-breakpoint
ALTER TABLE "barber_time_block" ADD CONSTRAINT "barber_time_block_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_time_block" ADD CONSTRAINT "barber_time_block_barber_id_user_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_block" ADD CONSTRAINT "customer_block_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_block" ADD CONSTRAINT "customer_block_barber_id_user_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_block" ADD CONSTRAINT "customer_block_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_config" ADD CONSTRAINT "schedule_config_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_config" ADD CONSTRAINT "schedule_config_barber_id_user_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "barber_time_block_barber_idx" ON "barber_time_block" USING btree ("barber_id");--> statement-breakpoint
CREATE INDEX "customer_block_barber_customer_idx" ON "customer_block" USING btree ("barber_id","customer_id");