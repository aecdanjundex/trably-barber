ALTER TABLE "commission_payment_item" DROP CONSTRAINT "commission_payment_item_commission_payment_id_commission_payment_id_fk";
--> statement-breakpoint
ALTER TABLE "commission_payment_item" DROP CONSTRAINT "commission_payment_item_service_order_item_id_service_order_item_id_fk";
--> statement-breakpoint
ALTER TABLE "service_order_item_professional" DROP CONSTRAINT "service_order_item_professional_service_order_item_id_service_order_item_id_fk";
--> statement-breakpoint
ALTER TABLE "commission_payment_item" ADD CONSTRAINT "cp_item_cp_fk" FOREIGN KEY ("commission_payment_id") REFERENCES "public"."commission_payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_payment_item" ADD CONSTRAINT "cp_item_soi_fk" FOREIGN KEY ("service_order_item_id") REFERENCES "public"."service_order_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_item_professional" ADD CONSTRAINT "soi_professional_soi_fk" FOREIGN KEY ("service_order_item_id") REFERENCES "public"."service_order_item"("id") ON DELETE cascade ON UPDATE no action;