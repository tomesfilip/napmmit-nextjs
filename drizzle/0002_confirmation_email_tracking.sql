ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "confirmation_email_sent_at" timestamp;
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "confirmation_email_message_id" varchar(255);
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "confirmation_email_failed_at" timestamp;
