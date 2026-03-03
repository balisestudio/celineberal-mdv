import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "about_press_locales" CASCADE;
  ALTER TABLE "about_press" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "about" ADD COLUMN "signature" varchar NOT NULL;
  ALTER TABLE "about_press" DROP COLUMN "url";
  ALTER TABLE "about_locales" DROP COLUMN "signature";`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "about_press_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "about_press" ADD COLUMN "url" varchar;
  ALTER TABLE "about_locales" ADD COLUMN "signature" varchar NOT NULL;
  ALTER TABLE "about_press_locales" ADD CONSTRAINT "about_press_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_press"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "about_press_locales_locale_parent_id_unique" ON "about_press_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "about_press" DROP COLUMN "label";
  ALTER TABLE "about" DROP COLUMN "signature";`);
}
