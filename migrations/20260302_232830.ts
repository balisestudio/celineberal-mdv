import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "auctions" ADD COLUMN "trigger_id" varchar;
  ALTER TABLE "_auctions_v" ADD COLUMN "version_trigger_id" varchar;`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "auctions" DROP COLUMN "trigger_id";
  ALTER TABLE "_auctions_v" DROP COLUMN "version_trigger_id";`);
}
