import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "legal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"siret" varchar NOT NULL,
  	"rcs" varchar NOT NULL,
  	"capital_social" varchar NOT NULL,
  	"agrement" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_locales" (
  	"legal_notice" jsonb NOT NULL,
  	"privacy_policy" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "legal_locales" ADD CONSTRAINT "legal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "legal_locales_locale_parent_id_unique" ON "legal_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "contact" DROP COLUMN "siret";
  ALTER TABLE "contact" DROP COLUMN "rcs";
  ALTER TABLE "contact" DROP COLUMN "capital_social";
  ALTER TABLE "contact" DROP COLUMN "agrement";`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "legal" CASCADE;
  DROP TABLE "legal_locales" CASCADE;
  ALTER TABLE "contact" ADD COLUMN "siret" varchar NOT NULL;
  ALTER TABLE "contact" ADD COLUMN "rcs" varchar NOT NULL;
  ALTER TABLE "contact" ADD COLUMN "capital_social" varchar NOT NULL;
  ALTER TABLE "contact" ADD COLUMN "agrement" varchar NOT NULL;`);
}
