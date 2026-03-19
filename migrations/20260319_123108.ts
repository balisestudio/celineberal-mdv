import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TYPE "public"."enum_guides_status" RENAME TO "enum_encyclopedia_status";
  ALTER TYPE "public"."enum__guides_v_version_status" RENAME TO "enum__encyclopedia_v_version_status";
  ALTER TYPE "public"."enum__guides_v_published_locale" RENAME TO "enum__encyclopedia_v_published_locale";
  ALTER TABLE "guides" RENAME TO "encyclopedia";
  ALTER TABLE "guides_locales" RENAME TO "encyclopedia_locales";
  ALTER TABLE "_guides_v" RENAME TO "_encyclopedia_v";
  ALTER TABLE "_guides_v_locales" RENAME TO "_encyclopedia_v_locales";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "guides_id" TO "encyclopedia_id";
  ALTER TABLE "encyclopedia" DROP CONSTRAINT "guides_poster_id_media_id_fk";
  
  ALTER TABLE "encyclopedia" DROP CONSTRAINT "guides_thematique_id_thematics_id_fk";
  
  ALTER TABLE "encyclopedia" DROP CONSTRAINT "guides_author_id_collaborators_id_fk";
  
  ALTER TABLE "encyclopedia_locales" DROP CONSTRAINT "guides_locales_parent_id_fk";
  
  ALTER TABLE "_encyclopedia_v" DROP CONSTRAINT "_guides_v_parent_id_guides_id_fk";
  
  ALTER TABLE "_encyclopedia_v" DROP CONSTRAINT "_guides_v_version_poster_id_media_id_fk";
  
  ALTER TABLE "_encyclopedia_v" DROP CONSTRAINT "_guides_v_version_thematique_id_thematics_id_fk";
  
  ALTER TABLE "_encyclopedia_v" DROP CONSTRAINT "_guides_v_version_author_id_collaborators_id_fk";
  
  ALTER TABLE "_encyclopedia_v_locales" DROP CONSTRAINT "_guides_v_locales_parent_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_guides_fk";

  ALTER TABLE "media" ALTER COLUMN "usage" SET DATA TYPE text;
  
  UPDATE "media"
  SET "usage" = 'encyclopedia'
  WHERE "usage" = 'guide';

  ALTER TABLE "media" ALTER COLUMN "usage" SET DATA TYPE text;
  DROP TYPE "public"."enum_media_usage";
  CREATE TYPE "public"."enum_media_usage" AS ENUM('lot', 'collaborator', 'auction', 'encyclopedia', 'internal', 'estimates');
  ALTER TABLE "media" ALTER COLUMN "usage" SET DATA TYPE "public"."enum_media_usage" USING "usage"::"public"."enum_media_usage";
  DROP INDEX "guides_slug_idx";
  DROP INDEX "guides_poster_idx";
  DROP INDEX "guides_thematique_idx";
  DROP INDEX "guides_author_idx";
  DROP INDEX "guides_updated_at_idx";
  DROP INDEX "guides_created_at_idx";
  DROP INDEX "guides__status_idx";
  DROP INDEX "guides_locales_locale_parent_id_unique";
  DROP INDEX "_guides_v_parent_idx";
  DROP INDEX "_guides_v_version_version_slug_idx";
  DROP INDEX "_guides_v_version_version_poster_idx";
  DROP INDEX "_guides_v_version_version_thematique_idx";
  DROP INDEX "_guides_v_version_version_author_idx";
  DROP INDEX "_guides_v_version_version_updated_at_idx";
  DROP INDEX "_guides_v_version_version_created_at_idx";
  DROP INDEX "_guides_v_version_version__status_idx";
  DROP INDEX "_guides_v_created_at_idx";
  DROP INDEX "_guides_v_updated_at_idx";
  DROP INDEX "_guides_v_snapshot_idx";
  DROP INDEX "_guides_v_published_locale_idx";
  DROP INDEX "_guides_v_latest_idx";
  DROP INDEX "_guides_v_locales_locale_parent_id_unique";
  DROP INDEX "payload_locked_documents_rels_guides_id_idx";
  ALTER TABLE "encyclopedia" ADD CONSTRAINT "encyclopedia_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "encyclopedia" ADD CONSTRAINT "encyclopedia_thematique_id_thematics_id_fk" FOREIGN KEY ("thematique_id") REFERENCES "public"."thematics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "encyclopedia" ADD CONSTRAINT "encyclopedia_author_id_collaborators_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."collaborators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "encyclopedia_locales" ADD CONSTRAINT "encyclopedia_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."encyclopedia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_encyclopedia_v" ADD CONSTRAINT "_encyclopedia_v_parent_id_encyclopedia_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."encyclopedia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_encyclopedia_v" ADD CONSTRAINT "_encyclopedia_v_version_poster_id_media_id_fk" FOREIGN KEY ("version_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_encyclopedia_v" ADD CONSTRAINT "_encyclopedia_v_version_thematique_id_thematics_id_fk" FOREIGN KEY ("version_thematique_id") REFERENCES "public"."thematics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_encyclopedia_v" ADD CONSTRAINT "_encyclopedia_v_version_author_id_collaborators_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."collaborators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_encyclopedia_v_locales" ADD CONSTRAINT "_encyclopedia_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_encyclopedia_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_encyclopedia_fk" FOREIGN KEY ("encyclopedia_id") REFERENCES "public"."encyclopedia"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "encyclopedia_slug_idx" ON "encyclopedia" USING btree ("slug");
  CREATE INDEX "encyclopedia_poster_idx" ON "encyclopedia" USING btree ("poster_id");
  CREATE INDEX "encyclopedia_thematique_idx" ON "encyclopedia" USING btree ("thematique_id");
  CREATE INDEX "encyclopedia_author_idx" ON "encyclopedia" USING btree ("author_id");
  CREATE INDEX "encyclopedia_updated_at_idx" ON "encyclopedia" USING btree ("updated_at");
  CREATE INDEX "encyclopedia_created_at_idx" ON "encyclopedia" USING btree ("created_at");
  CREATE INDEX "encyclopedia__status_idx" ON "encyclopedia" USING btree ("_status");
  CREATE UNIQUE INDEX "encyclopedia_locales_locale_parent_id_unique" ON "encyclopedia_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_encyclopedia_v_parent_idx" ON "_encyclopedia_v" USING btree ("parent_id");
  CREATE INDEX "_encyclopedia_v_version_version_slug_idx" ON "_encyclopedia_v" USING btree ("version_slug");
  CREATE INDEX "_encyclopedia_v_version_version_poster_idx" ON "_encyclopedia_v" USING btree ("version_poster_id");
  CREATE INDEX "_encyclopedia_v_version_version_thematique_idx" ON "_encyclopedia_v" USING btree ("version_thematique_id");
  CREATE INDEX "_encyclopedia_v_version_version_author_idx" ON "_encyclopedia_v" USING btree ("version_author_id");
  CREATE INDEX "_encyclopedia_v_version_version_updated_at_idx" ON "_encyclopedia_v" USING btree ("version_updated_at");
  CREATE INDEX "_encyclopedia_v_version_version_created_at_idx" ON "_encyclopedia_v" USING btree ("version_created_at");
  CREATE INDEX "_encyclopedia_v_version_version__status_idx" ON "_encyclopedia_v" USING btree ("version__status");
  CREATE INDEX "_encyclopedia_v_created_at_idx" ON "_encyclopedia_v" USING btree ("created_at");
  CREATE INDEX "_encyclopedia_v_updated_at_idx" ON "_encyclopedia_v" USING btree ("updated_at");
  CREATE INDEX "_encyclopedia_v_snapshot_idx" ON "_encyclopedia_v" USING btree ("snapshot");
  CREATE INDEX "_encyclopedia_v_published_locale_idx" ON "_encyclopedia_v" USING btree ("published_locale");
  CREATE INDEX "_encyclopedia_v_latest_idx" ON "_encyclopedia_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_encyclopedia_v_locales_locale_parent_id_unique" ON "_encyclopedia_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "payload_locked_documents_rels_encyclopedia_id_idx" ON "payload_locked_documents_rels" USING btree ("encyclopedia_id");`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TYPE "public"."enum_encyclopedia_status" RENAME TO "enum_guides_status";
  ALTER TYPE "public"."enum__encyclopedia_v_version_status" RENAME TO "enum__guides_v_version_status";
  ALTER TYPE "public"."enum__encyclopedia_v_published_locale" RENAME TO "enum__guides_v_published_locale";
  ALTER TABLE "encyclopedia" RENAME TO "guides";
  ALTER TABLE "encyclopedia_locales" RENAME TO "guides_locales";
  ALTER TABLE "_encyclopedia_v" RENAME TO "_guides_v";
  ALTER TABLE "_encyclopedia_v_locales" RENAME TO "_guides_v_locales";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "encyclopedia_id" TO "guides_id";
  ALTER TABLE "guides" DROP CONSTRAINT "encyclopedia_poster_id_media_id_fk";
  
  ALTER TABLE "guides" DROP CONSTRAINT "encyclopedia_thematique_id_thematics_id_fk";
  
  ALTER TABLE "guides" DROP CONSTRAINT "encyclopedia_author_id_collaborators_id_fk";
  
  ALTER TABLE "guides_locales" DROP CONSTRAINT "encyclopedia_locales_parent_id_fk";
  
  ALTER TABLE "_guides_v" DROP CONSTRAINT "_encyclopedia_v_parent_id_encyclopedia_id_fk";
  
  ALTER TABLE "_guides_v" DROP CONSTRAINT "_encyclopedia_v_version_poster_id_media_id_fk";
  
  ALTER TABLE "_guides_v" DROP CONSTRAINT "_encyclopedia_v_version_thematique_id_thematics_id_fk";
  
  ALTER TABLE "_guides_v" DROP CONSTRAINT "_encyclopedia_v_version_author_id_collaborators_id_fk";
  
  ALTER TABLE "_guides_v_locales" DROP CONSTRAINT "_encyclopedia_v_locales_parent_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_encyclopedia_fk";
  
  ALTER TABLE "media" ALTER COLUMN "usage" SET DATA TYPE text;
  DROP TYPE "public"."enum_media_usage";
  CREATE TYPE "public"."enum_media_usage" AS ENUM('lot', 'collaborator', 'auction', 'guide', 'internal', 'estimates');
  ALTER TABLE "media" ALTER COLUMN "usage" SET DATA TYPE "public"."enum_media_usage" USING "usage"::"public"."enum_media_usage";
  DROP INDEX "encyclopedia_slug_idx";
  DROP INDEX "encyclopedia_poster_idx";
  DROP INDEX "encyclopedia_thematique_idx";
  DROP INDEX "encyclopedia_author_idx";
  DROP INDEX "encyclopedia_updated_at_idx";
  DROP INDEX "encyclopedia_created_at_idx";
  DROP INDEX "encyclopedia__status_idx";
  DROP INDEX "encyclopedia_locales_locale_parent_id_unique";
  DROP INDEX "_encyclopedia_v_parent_idx";
  DROP INDEX "_encyclopedia_v_version_version_slug_idx";
  DROP INDEX "_encyclopedia_v_version_version_poster_idx";
  DROP INDEX "_encyclopedia_v_version_version_thematique_idx";
  DROP INDEX "_encyclopedia_v_version_version_author_idx";
  DROP INDEX "_encyclopedia_v_version_version_updated_at_idx";
  DROP INDEX "_encyclopedia_v_version_version_created_at_idx";
  DROP INDEX "_encyclopedia_v_version_version__status_idx";
  DROP INDEX "_encyclopedia_v_created_at_idx";
  DROP INDEX "_encyclopedia_v_updated_at_idx";
  DROP INDEX "_encyclopedia_v_snapshot_idx";
  DROP INDEX "_encyclopedia_v_published_locale_idx";
  DROP INDEX "_encyclopedia_v_latest_idx";
  DROP INDEX "_encyclopedia_v_locales_locale_parent_id_unique";
  DROP INDEX "payload_locked_documents_rels_encyclopedia_id_idx";
  ALTER TABLE "guides" ADD CONSTRAINT "guides_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_thematique_id_thematics_id_fk" FOREIGN KEY ("thematique_id") REFERENCES "public"."thematics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_author_id_collaborators_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."collaborators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides_locales" ADD CONSTRAINT "guides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_parent_id_guides_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."guides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_poster_id_media_id_fk" FOREIGN KEY ("version_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_thematique_id_thematics_id_fk" FOREIGN KEY ("version_thematique_id") REFERENCES "public"."thematics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v" ADD CONSTRAINT "_guides_v_version_author_id_collaborators_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."collaborators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_guides_v_locales" ADD CONSTRAINT "_guides_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "guides_slug_idx" ON "guides" USING btree ("slug");
  CREATE INDEX "guides_poster_idx" ON "guides" USING btree ("poster_id");
  CREATE INDEX "guides_thematique_idx" ON "guides" USING btree ("thematique_id");
  CREATE INDEX "guides_author_idx" ON "guides" USING btree ("author_id");
  CREATE INDEX "guides_updated_at_idx" ON "guides" USING btree ("updated_at");
  CREATE INDEX "guides_created_at_idx" ON "guides" USING btree ("created_at");
  CREATE INDEX "guides__status_idx" ON "guides" USING btree ("_status");
  CREATE UNIQUE INDEX "guides_locales_locale_parent_id_unique" ON "guides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_guides_v_parent_idx" ON "_guides_v" USING btree ("parent_id");
  CREATE INDEX "_guides_v_version_version_slug_idx" ON "_guides_v" USING btree ("version_slug");
  CREATE INDEX "_guides_v_version_version_poster_idx" ON "_guides_v" USING btree ("version_poster_id");
  CREATE INDEX "_guides_v_version_version_thematique_idx" ON "_guides_v" USING btree ("version_thematique_id");
  CREATE INDEX "_guides_v_version_version_author_idx" ON "_guides_v" USING btree ("version_author_id");
  CREATE INDEX "_guides_v_version_version_updated_at_idx" ON "_guides_v" USING btree ("version_updated_at");
  CREATE INDEX "_guides_v_version_version_created_at_idx" ON "_guides_v" USING btree ("version_created_at");
  CREATE INDEX "_guides_v_version_version__status_idx" ON "_guides_v" USING btree ("version__status");
  CREATE INDEX "_guides_v_created_at_idx" ON "_guides_v" USING btree ("created_at");
  CREATE INDEX "_guides_v_updated_at_idx" ON "_guides_v" USING btree ("updated_at");
  CREATE INDEX "_guides_v_snapshot_idx" ON "_guides_v" USING btree ("snapshot");
  CREATE INDEX "_guides_v_published_locale_idx" ON "_guides_v" USING btree ("published_locale");
  CREATE INDEX "_guides_v_latest_idx" ON "_guides_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_guides_v_locales_locale_parent_id_unique" ON "_guides_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "payload_locked_documents_rels_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("guides_id");`);
}
