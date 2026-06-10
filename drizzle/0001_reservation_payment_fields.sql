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

ALTER TABLE "cottages" ADD COLUMN IF NOT EXISTS "total_beds" integer;
UPDATE "cottages" SET "total_beds" = 1 WHERE "total_beds" IS NULL;
ALTER TABLE "cottages" ALTER COLUMN "total_beds" SET NOT NULL;

CREATE TABLE IF NOT EXISTS "reservation_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"reservation_id" integer NOT NULL,
	"date" date NOT NULL,
	"beds_reserved" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "reservation_days" ADD CONSTRAINT "reservation_days_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

INSERT INTO "reservation_days" ("reservation_id", "date", "beds_reserved")
SELECT
	"reservations"."id",
	"reservation_date"."date"::date,
	"reservations"."beds_reserved"
FROM "reservations"
CROSS JOIN LATERAL generate_series(
	"reservations"."from"::date,
	("reservations"."to"::date - INTERVAL '1 day')::date,
	INTERVAL '1 day'
) AS "reservation_date"("date")
WHERE "reservations"."from" < "reservations"."to"
AND NOT EXISTS (
	SELECT 1
	FROM "reservation_days"
	WHERE "reservation_days"."reservation_id" = "reservations"."id"
	AND "reservation_days"."date" = "reservation_date"."date"::date
);
