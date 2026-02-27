import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_media_usage" AS ENUM('lot', 'collaborator', 'auction', 'internal', 'estimates');
  CREATE TYPE "public"."enum_auctions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__auctions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__auctions_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_estimates_civility" AS ENUM('madame', 'monsieur', 'autre');
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "collaborators" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lots_characteristics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "lots_characteristics_locales" (
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "lots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lot_number" varchar NOT NULL,
  	"internal_lot_number" numeric,
  	"low_estimate" numeric,
  	"high_estimate" numeric,
  	"sold" boolean DEFAULT false,
  	"sale_price" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lots_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "lots_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "auctions_lots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lot_id" integer
  );
  
  CREATE TABLE "auctions_collaborators" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"collaborator_id" integer
  );
  
  CREATE TABLE "auctions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"auction_date" timestamp(3) with time zone,
  	"location" varchar,
  	"poster_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_auctions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "auctions_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_auctions_v_version_lots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lot_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_auctions_v_version_collaborators" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"collaborator_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_auctions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_auction_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_poster_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__auctions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__auctions_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_auctions_v_locales" (
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "estimates_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL
  );
  
  CREATE TABLE "estimates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"civility" "enum_estimates_civility" NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"address" varchar,
  	"postal_code" varchar,
  	"city" varchar,
  	"dimensions" varchar,
  	"descriptions" varchar,
  	"accepted_terms" boolean DEFAULT false NOT NULL,
  	"allows_photo_reuse" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "usage" "enum_media_usage" NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "collaborators_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lots_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "auctions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "estimates_id" integer;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lots_characteristics" ADD CONSTRAINT "lots_characteristics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lots_characteristics_locales" ADD CONSTRAINT "lots_characteristics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lots_characteristics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lots_locales" ADD CONSTRAINT "lots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lots_rels" ADD CONSTRAINT "lots_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lots_rels" ADD CONSTRAINT "lots_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "auctions_lots" ADD CONSTRAINT "auctions_lots_lot_id_lots_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lots"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "auctions_lots" ADD CONSTRAINT "auctions_lots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."auctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "auctions_collaborators" ADD CONSTRAINT "auctions_collaborators_collaborator_id_collaborators_id_fk" FOREIGN KEY ("collaborator_id") REFERENCES "public"."collaborators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "auctions_collaborators" ADD CONSTRAINT "auctions_collaborators_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."auctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "auctions" ADD CONSTRAINT "auctions_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "auctions_locales" ADD CONSTRAINT "auctions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."auctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_auctions_v_version_lots" ADD CONSTRAINT "_auctions_v_version_lots_lot_id_lots_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lots"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_auctions_v_version_lots" ADD CONSTRAINT "_auctions_v_version_lots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_auctions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_auctions_v_version_collaborators" ADD CONSTRAINT "_auctions_v_version_collaborators_collaborator_id_collaborators_id_fk" FOREIGN KEY ("collaborator_id") REFERENCES "public"."collaborators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_auctions_v_version_collaborators" ADD CONSTRAINT "_auctions_v_version_collaborators_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_auctions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_auctions_v" ADD CONSTRAINT "_auctions_v_parent_id_auctions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."auctions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_auctions_v" ADD CONSTRAINT "_auctions_v_version_poster_id_media_id_fk" FOREIGN KEY ("version_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_auctions_v_locales" ADD CONSTRAINT "_auctions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_auctions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "estimates_photos" ADD CONSTRAINT "estimates_photos_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "estimates_photos" ADD CONSTRAINT "estimates_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."estimates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "collaborators_photo_idx" ON "collaborators" USING btree ("photo_id");
  CREATE INDEX "collaborators_updated_at_idx" ON "collaborators" USING btree ("updated_at");
  CREATE INDEX "collaborators_created_at_idx" ON "collaborators" USING btree ("created_at");
  CREATE INDEX "lots_characteristics_order_idx" ON "lots_characteristics" USING btree ("_order");
  CREATE INDEX "lots_characteristics_parent_id_idx" ON "lots_characteristics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "lots_characteristics_locales_locale_parent_id_unique" ON "lots_characteristics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lots_updated_at_idx" ON "lots" USING btree ("updated_at");
  CREATE INDEX "lots_created_at_idx" ON "lots" USING btree ("created_at");
  CREATE UNIQUE INDEX "lots_locales_locale_parent_id_unique" ON "lots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lots_rels_order_idx" ON "lots_rels" USING btree ("order");
  CREATE INDEX "lots_rels_parent_idx" ON "lots_rels" USING btree ("parent_id");
  CREATE INDEX "lots_rels_path_idx" ON "lots_rels" USING btree ("path");
  CREATE INDEX "lots_rels_media_id_idx" ON "lots_rels" USING btree ("media_id");
  CREATE INDEX "auctions_lots_order_idx" ON "auctions_lots" USING btree ("_order");
  CREATE INDEX "auctions_lots_parent_id_idx" ON "auctions_lots" USING btree ("_parent_id");
  CREATE INDEX "auctions_lots_lot_idx" ON "auctions_lots" USING btree ("lot_id");
  CREATE INDEX "auctions_collaborators_order_idx" ON "auctions_collaborators" USING btree ("_order");
  CREATE INDEX "auctions_collaborators_parent_id_idx" ON "auctions_collaborators" USING btree ("_parent_id");
  CREATE INDEX "auctions_collaborators_collaborator_idx" ON "auctions_collaborators" USING btree ("collaborator_id");
  CREATE INDEX "auctions_poster_idx" ON "auctions" USING btree ("poster_id");
  CREATE UNIQUE INDEX "auctions_slug_idx" ON "auctions" USING btree ("slug");
  CREATE INDEX "auctions_updated_at_idx" ON "auctions" USING btree ("updated_at");
  CREATE INDEX "auctions_created_at_idx" ON "auctions" USING btree ("created_at");
  CREATE INDEX "auctions__status_idx" ON "auctions" USING btree ("_status");
  CREATE UNIQUE INDEX "auctions_locales_locale_parent_id_unique" ON "auctions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_auctions_v_version_lots_order_idx" ON "_auctions_v_version_lots" USING btree ("_order");
  CREATE INDEX "_auctions_v_version_lots_parent_id_idx" ON "_auctions_v_version_lots" USING btree ("_parent_id");
  CREATE INDEX "_auctions_v_version_lots_lot_idx" ON "_auctions_v_version_lots" USING btree ("lot_id");
  CREATE INDEX "_auctions_v_version_collaborators_order_idx" ON "_auctions_v_version_collaborators" USING btree ("_order");
  CREATE INDEX "_auctions_v_version_collaborators_parent_id_idx" ON "_auctions_v_version_collaborators" USING btree ("_parent_id");
  CREATE INDEX "_auctions_v_version_collaborators_collaborator_idx" ON "_auctions_v_version_collaborators" USING btree ("collaborator_id");
  CREATE INDEX "_auctions_v_parent_idx" ON "_auctions_v" USING btree ("parent_id");
  CREATE INDEX "_auctions_v_version_version_poster_idx" ON "_auctions_v" USING btree ("version_poster_id");
  CREATE INDEX "_auctions_v_version_version_slug_idx" ON "_auctions_v" USING btree ("version_slug");
  CREATE INDEX "_auctions_v_version_version_updated_at_idx" ON "_auctions_v" USING btree ("version_updated_at");
  CREATE INDEX "_auctions_v_version_version_created_at_idx" ON "_auctions_v" USING btree ("version_created_at");
  CREATE INDEX "_auctions_v_version_version__status_idx" ON "_auctions_v" USING btree ("version__status");
  CREATE INDEX "_auctions_v_created_at_idx" ON "_auctions_v" USING btree ("created_at");
  CREATE INDEX "_auctions_v_updated_at_idx" ON "_auctions_v" USING btree ("updated_at");
  CREATE INDEX "_auctions_v_snapshot_idx" ON "_auctions_v" USING btree ("snapshot");
  CREATE INDEX "_auctions_v_published_locale_idx" ON "_auctions_v" USING btree ("published_locale");
  CREATE INDEX "_auctions_v_latest_idx" ON "_auctions_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_auctions_v_locales_locale_parent_id_unique" ON "_auctions_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "estimates_photos_order_idx" ON "estimates_photos" USING btree ("_order");
  CREATE INDEX "estimates_photos_parent_id_idx" ON "estimates_photos" USING btree ("_parent_id");
  CREATE INDEX "estimates_photos_media_idx" ON "estimates_photos" USING btree ("media_id");
  CREATE INDEX "estimates_updated_at_idx" ON "estimates" USING btree ("updated_at");
  CREATE INDEX "estimates_created_at_idx" ON "estimates" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collaborators_fk" FOREIGN KEY ("collaborators_id") REFERENCES "public"."collaborators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lots_fk" FOREIGN KEY ("lots_id") REFERENCES "public"."lots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_auctions_fk" FOREIGN KEY ("auctions_id") REFERENCES "public"."auctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_estimates_fk" FOREIGN KEY ("estimates_id") REFERENCES "public"."estimates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_collaborators_id_idx" ON "payload_locked_documents_rels" USING btree ("collaborators_id");
  CREATE INDEX "payload_locked_documents_rels_lots_id_idx" ON "payload_locked_documents_rels" USING btree ("lots_id");
  CREATE INDEX "payload_locked_documents_rels_auctions_id_idx" ON "payload_locked_documents_rels" USING btree ("auctions_id");
  CREATE INDEX "payload_locked_documents_rels_estimates_id_idx" ON "payload_locked_documents_rels" USING btree ("estimates_id");
  ALTER TABLE "media" DROP COLUMN "alt";`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collaborators" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lots_characteristics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lots_characteristics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lots_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lots_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "auctions_lots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "auctions_collaborators" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "auctions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "auctions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_auctions_v_version_lots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_auctions_v_version_collaborators" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_auctions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_auctions_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "estimates_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "estimates" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "collaborators" CASCADE;
  DROP TABLE "lots_characteristics" CASCADE;
  DROP TABLE "lots_characteristics_locales" CASCADE;
  DROP TABLE "lots" CASCADE;
  DROP TABLE "lots_locales" CASCADE;
  DROP TABLE "lots_rels" CASCADE;
  DROP TABLE "auctions_lots" CASCADE;
  DROP TABLE "auctions_collaborators" CASCADE;
  DROP TABLE "auctions" CASCADE;
  DROP TABLE "auctions_locales" CASCADE;
  DROP TABLE "_auctions_v_version_lots" CASCADE;
  DROP TABLE "_auctions_v_version_collaborators" CASCADE;
  DROP TABLE "_auctions_v" CASCADE;
  DROP TABLE "_auctions_v_locales" CASCADE;
  DROP TABLE "estimates_photos" CASCADE;
  DROP TABLE "estimates" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_collaborators_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lots_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_auctions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_estimates_fk";
  
  DROP INDEX "payload_locked_documents_rels_collaborators_id_idx";
  DROP INDEX "payload_locked_documents_rels_lots_id_idx";
  DROP INDEX "payload_locked_documents_rels_auctions_id_idx";
  DROP INDEX "payload_locked_documents_rels_estimates_id_idx";
  ALTER TABLE "media" ADD COLUMN "alt" varchar;
  ALTER TABLE "media" DROP COLUMN "usage";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "collaborators_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lots_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "auctions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "estimates_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_media_usage";
  DROP TYPE "public"."enum_auctions_status";
  DROP TYPE "public"."enum__auctions_v_version_status";
  DROP TYPE "public"."enum__auctions_v_published_locale";
  DROP TYPE "public"."enum_estimates_civility";`);
}
