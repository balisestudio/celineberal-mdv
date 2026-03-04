import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "about_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"collaborators_id" integer
  );
  
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_collaborators_fk" FOREIGN KEY ("collaborators_id") REFERENCES "public"."collaborators"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_rels_order_idx" ON "about_rels" USING btree ("order");
  CREATE INDEX "about_rels_parent_idx" ON "about_rels" USING btree ("parent_id");
  CREATE INDEX "about_rels_path_idx" ON "about_rels" USING btree ("path");
  CREATE INDEX "about_rels_collaborators_id_idx" ON "about_rels" USING btree ("collaborators_id");`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "about_rels" CASCADE;`);
}
