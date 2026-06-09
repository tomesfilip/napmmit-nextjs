DO $$ BEGIN
 CREATE TYPE "payment_status" AS ENUM('unpaid', 'paid', 'refunded', 'refund_failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "reservations" RENAME COLUMN "reservation_fee" TO "reservation_fee_cents";
ALTER TABLE "reservations" RENAME COLUMN "refund_amount" TO "refund_amount_cents";

ALTER TABLE "reservations" ALTER COLUMN "reservation_fee_cents" SET DEFAULT 100;
ALTER TABLE "reservations" ALTER COLUMN "refund_amount_cents" SET DEFAULT 0;
ALTER TABLE "reservations" ALTER COLUMN "refund_amount_cents" SET NOT NULL;

ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL;
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "stripe_checkout_session_id" varchar(255);
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "stripe_payment_intent_id" varchar(255);
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "stripe_refund_id" varchar(255);
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "paid_at" timestamp;
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "refunded_at" timestamp;

CREATE UNIQUE INDEX IF NOT EXISTS "reservations_stripe_checkout_session_id_unique"
ON "reservations" ("stripe_checkout_session_id");
