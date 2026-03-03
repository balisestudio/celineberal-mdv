import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_graphics_logo_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_graphics_icon_id_media_id_fk";
  
  DROP INDEX "site_settings_graphics_graphics_logo_idx";
  DROP INDEX "site_settings_graphics_graphics_icon_idx";
  ALTER TABLE "site_settings" ADD COLUMN "graphics_logo_dark_id" integer NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "graphics_logo_light_id" integer NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "graphics_icon_dark_id" integer NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "graphics_icon_light_id" integer NOT NULL;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_graphics_logo_dark_id_media_id_fk" FOREIGN KEY ("graphics_logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_graphics_logo_light_id_media_id_fk" FOREIGN KEY ("graphics_logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_graphics_icon_dark_id_media_id_fk" FOREIGN KEY ("graphics_icon_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_graphics_icon_light_id_media_id_fk" FOREIGN KEY ("graphics_icon_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_graphics_logo_graphics_logo_dark_idx" ON "site_settings" USING btree ("graphics_logo_dark_id");
  CREATE INDEX "site_settings_graphics_logo_graphics_logo_light_idx" ON "site_settings" USING btree ("graphics_logo_light_id");
  CREATE INDEX "site_settings_graphics_icon_graphics_icon_dark_idx" ON "site_settings" USING btree ("graphics_icon_dark_id");
  CREATE INDEX "site_settings_graphics_icon_graphics_icon_light_idx" ON "site_settings" USING btree ("graphics_icon_light_id");
  ALTER TABLE "site_settings" DROP COLUMN "graphics_logo_id";
  ALTER TABLE "site_settings" DROP COLUMN "graphics_icon_id";`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_graphics_logo_dark_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_graphics_logo_light_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_graphics_icon_dark_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_graphics_icon_light_id_media_id_fk";
  
  DROP INDEX "site_settings_graphics_logo_graphics_logo_dark_idx";
  DROP INDEX "site_settings_graphics_logo_graphics_logo_light_idx";
  DROP INDEX "site_settings_graphics_icon_graphics_icon_dark_idx";
  DROP INDEX "site_settings_graphics_icon_graphics_icon_light_idx";
  ALTER TABLE "site_settings" ADD COLUMN "graphics_logo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "graphics_icon_id" integer;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_graphics_logo_id_media_id_fk" FOREIGN KEY ("graphics_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_graphics_icon_id_media_id_fk" FOREIGN KEY ("graphics_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_graphics_graphics_logo_idx" ON "site_settings" USING btree ("graphics_logo_id");
  CREATE INDEX "site_settings_graphics_graphics_icon_idx" ON "site_settings" USING btree ("graphics_icon_id");
  ALTER TABLE "site_settings" DROP COLUMN "graphics_logo_dark_id";
  ALTER TABLE "site_settings" DROP COLUMN "graphics_logo_light_id";
  ALTER TABLE "site_settings" DROP COLUMN "graphics_icon_dark_id";
  ALTER TABLE "site_settings" DROP COLUMN "graphics_icon_light_id";`);
}
