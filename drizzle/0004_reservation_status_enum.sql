DO $$ BEGIN
 CREATE TYPE "reservation_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
UPDATE "reservations"
SET "status" = 'pending'
WHERE "status" NOT IN ('pending', 'confirmed', 'cancelled', 'completed');
--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" TYPE "reservation_status" USING "status"::"reservation_status";
--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending';
