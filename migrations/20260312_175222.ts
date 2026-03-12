import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "about_press" ADD COLUMN "logo_id" integer;
  ALTER TABLE "about_press" ADD CONSTRAINT "about_press_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_press_logo_idx" ON "about_press" USING btree ("logo_id");`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "about_press" DROP CONSTRAINT "about_press_logo_id_media_id_fk";
  
  DROP INDEX "about_press_logo_idx";
  ALTER TABLE "about_press" DROP COLUMN "logo_id";`);
}
