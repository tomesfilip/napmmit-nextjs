DO $$ BEGIN
 CREATE TYPE "payment_status" AS ENUM('unpaid', 'paid', 'refunded', 'refund_failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('hiker', 'cottage_owner', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"username" varchar(50) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_email_verified" boolean,
	"role" "user_role" DEFAULT 'hiker' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"icon" varchar NOT NULL,
	CONSTRAINT "services_name_unique" UNIQUE("name")
);

CREATE TABLE IF NOT EXISTS "cottages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar,
	"address" varchar NOT NULL,
	"mountain_area" varchar(255) NOT NULL,
	"total_beds" integer NOT NULL,
	"price_per_night" integer NOT NULL,
	"price_low_per_night" integer,
	"price_breakfast" integer,
	"price_dinner" integer,
	"phone_number" varchar,
	"email" varchar,
	"website" varchar,
	"user_id" varchar(21) NOT NULL,
	"locationURL" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"unAvailabilityDates" date[] DEFAULT '{}',
	CONSTRAINT "cottages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(21),
	"cottage_id" integer NOT NULL,
	"guest_email" varchar(100),
	"guest_phone" varchar(20),
	"beds_reserved" integer NOT NULL,
	"reservation_fee_cents" integer DEFAULT 100 NOT NULL,
	"refund_amount_cents" integer DEFAULT 0 NOT NULL,
	"payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL,
	"stripe_checkout_session_id" varchar(255),
	"stripe_payment_intent_id" varchar(255),
	"stripe_refund_id" varchar(255),
	"price_per_night" integer NOT NULL,
	"total_price" integer NOT NULL,
	"from" date NOT NULL,
	"to" date NOT NULL,
	"status" varchar(20) NOT NULL,
	"access_token" varchar(64),
	"paid_at" timestamp,
	"refunded_at" timestamp,
	"confirmation_email_sent_at" timestamp,
	"confirmation_email_message_id" varchar(255),
	"confirmation_email_failed_at" timestamp,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "reservations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action,
	CONSTRAINT "reservations_cottage_id_cottages_id_fk" FOREIGN KEY ("cottage_id") REFERENCES "public"."cottages"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "reservations_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id"),
	CONSTRAINT "reservations_access_token_unique" UNIQUE("access_token")
);

CREATE TABLE IF NOT EXISTS "reservation_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"reservation_id" integer NOT NULL,
	"date" date NOT NULL,
	"beds_reserved" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reservation_days_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"email" varchar(100) NOT NULL,
	"code" varchar(8) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "email_verification_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action,
	CONSTRAINT "email_verification_codes_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action,
	CONSTRAINT "email_verification_codes_user_id_unique" UNIQUE("user_id")
);

CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"cottage_id" integer NOT NULL,
	"src" varchar(255) NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "images_cottage_id_cottages_id_fk" FOREIGN KEY ("cottage_id") REFERENCES "public"."cottages"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "cottage_services" (
	"cottage_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	CONSTRAINT "cottage_services_cottage_id_service_id_pk" PRIMARY KEY("cottage_id","service_id"),
	CONSTRAINT "cottage_services_cottage_id_cottages_id_fk" FOREIGN KEY ("cottage_id") REFERENCES "public"."cottages"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "cottage_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action
);
