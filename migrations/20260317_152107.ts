import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "guides" ADD COLUMN "author_id" integer;
  ALTER TABLE "_guides_v" ADD COLUMN "version_author_id" integer;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_author_id_collaborators_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."collaborators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_author_id_collaborators_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."collaborators"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "guides_author_idx" ON "guides" USING btree ("author_id");
  CREATE INDEX "_guides_v_version_version_author_idx" ON "_guides_v" USING btree ("version_author_id");`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "guides" DROP CONSTRAINT "guides_author_id_collaborators_id_fk";
  
  ALTER TABLE "_guides_v" DROP CONSTRAINT "_guides_v_version_author_id_collaborators_id_fk";
  
  DROP INDEX "guides_author_idx";
  DROP INDEX "_guides_v_version_version_author_idx";
  ALTER TABLE "guides" DROP COLUMN "author_id";
  ALTER TABLE "_guides_v" DROP COLUMN "version_author_id";`);
}
