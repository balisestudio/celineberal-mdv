import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "about_locales" ALTER COLUMN "about_text" SET NOT NULL;
  ALTER TABLE "about_locales" DROP COLUMN "hero_title";`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "about_locales" ALTER COLUMN "about_text" DROP NOT NULL;
  ALTER TABLE "about_locales" ADD COLUMN "hero_title" varchar NOT NULL;`);
}
