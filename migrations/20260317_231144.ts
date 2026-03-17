import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "guides" ADD COLUMN "hide_from_list" boolean DEFAULT false;
  ALTER TABLE "_guides_v" ADD COLUMN "version_hide_from_list" boolean DEFAULT false;`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "guides" DROP COLUMN "hide_from_list";
  ALTER TABLE "_guides_v" DROP COLUMN "version_hide_from_list";`);
}
