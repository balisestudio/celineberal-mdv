import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "collaborators_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP TABLE "auctions_collaborators_locales" CASCADE;
  DROP TABLE "_auctions_v_version_collaborators_locales" CASCADE;
  ALTER TABLE "collaborators_locales" ADD CONSTRAINT "collaborators_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collaborators"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "collaborators_locales_locale_parent_id_unique" ON "collaborators_locales" USING btree ("_locale","_parent_id");`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "auctions_collaborators_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_auctions_v_version_collaborators_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP TABLE "collaborators_locales" CASCADE;
  ALTER TABLE "auctions_collaborators_locales" ADD CONSTRAINT "auctions_collaborators_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."auctions_collaborators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_auctions_v_version_collaborators_locales" ADD CONSTRAINT "_auctions_v_version_collaborators_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_auctions_v_version_collaborators"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "auctions_collaborators_locales_locale_parent_id_unique" ON "auctions_collaborators_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_auctions_v_version_collaborators_locales_locale_parent_id_u" ON "_auctions_v_version_collaborators_locales" USING btree ("_locale","_parent_id");`);
}
