ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "confirmation_email_claimed_at" timestamp;
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "confirmation_email_claim_token" varchar(64);
