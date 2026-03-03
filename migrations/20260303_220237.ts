import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "contact_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "about_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_values_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_press" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "about_press_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"about_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_locales" (
  	"hero_title" varchar NOT NULL,
  	"manifesto" varchar NOT NULL,
  	"signature" varchar NOT NULL,
  	"about_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "contact" ADD COLUMN "horaires" varchar;
  ALTER TABLE "contact_social_links" ADD CONSTRAINT "contact_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_values" ADD CONSTRAINT "about_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_values_locales" ADD CONSTRAINT "about_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_press" ADD CONSTRAINT "about_press_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_press_locales" ADD CONSTRAINT "about_press_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_press"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_social_links_order_idx" ON "contact_social_links" USING btree ("_order");
  CREATE INDEX "contact_social_links_parent_id_idx" ON "contact_social_links" USING btree ("_parent_id");
  CREATE INDEX "about_values_order_idx" ON "about_values" USING btree ("_order");
  CREATE INDEX "about_values_parent_id_idx" ON "about_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_values_locales_locale_parent_id_unique" ON "about_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_press_order_idx" ON "about_press" USING btree ("_order");
  CREATE INDEX "about_press_parent_id_idx" ON "about_press" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_press_locales_locale_parent_id_unique" ON "about_press_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_about_image_idx" ON "about" USING btree ("about_image_id");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "contact_social_links" CASCADE;
  DROP TABLE "about_values" CASCADE;
  DROP TABLE "about_values_locales" CASCADE;
  DROP TABLE "about_press" CASCADE;
  DROP TABLE "about_press_locales" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  ALTER TABLE "contact" DROP COLUMN "horaires";`);
}
