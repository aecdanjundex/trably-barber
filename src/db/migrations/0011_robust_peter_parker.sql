CREATE TABLE "barber_daily_block" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"barber_id" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"reason" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customer_block" ADD COLUMN "start_time" text;--> statement-breakpoint
ALTER TABLE "customer_block" ADD COLUMN "end_time" text;--> statement-breakpoint
ALTER TABLE "barber_daily_block" ADD CONSTRAINT "barber_daily_block_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_daily_block" ADD CONSTRAINT "barber_daily_block_barber_id_user_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "barber_daily_block_barber_idx" ON "barber_daily_block" USING btree ("barber_id");