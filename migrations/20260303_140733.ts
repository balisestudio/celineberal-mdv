import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "auctions_lots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_auctions_v_version_lots" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "auctions_lots" CASCADE;
  DROP TABLE "_auctions_v_version_lots" CASCADE;
  ALTER TABLE "lots" ADD COLUMN "auction_id" integer NOT NULL;
  ALTER TABLE "lots" ADD CONSTRAINT "lots_auction_id_auctions_id_fk" FOREIGN KEY ("auction_id") REFERENCES "public"."auctions"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "lots_auction_idx" ON "lots" USING btree ("auction_id");`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "auctions_lots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lot_id" integer
  );
  
  CREATE TABLE "_auctions_v_version_lots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lot_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "lots" DROP CONSTRAINT "lots_auction_id_auctions_id_fk";
  
  DROP INDEX "lots_auction_idx";
  ALTER TABLE "auctions_lots" ADD CONSTRAINT "auctions_lots_lot_id_lots_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lots"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "auctions_lots" ADD CONSTRAINT "auctions_lots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."auctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_auctions_v_version_lots" ADD CONSTRAINT "_auctions_v_version_lots_lot_id_lots_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lots"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_auctions_v_version_lots" ADD CONSTRAINT "_auctions_v_version_lots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_auctions_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "auctions_lots_order_idx" ON "auctions_lots" USING btree ("_order");
  CREATE INDEX "auctions_lots_parent_id_idx" ON "auctions_lots" USING btree ("_parent_id");
  CREATE INDEX "auctions_lots_lot_idx" ON "auctions_lots" USING btree ("lot_id");
  CREATE INDEX "_auctions_v_version_lots_order_idx" ON "_auctions_v_version_lots" USING btree ("_order");
  CREATE INDEX "_auctions_v_version_lots_parent_id_idx" ON "_auctions_v_version_lots" USING btree ("_parent_id");
  CREATE INDEX "_auctions_v_version_lots_lot_idx" ON "_auctions_v_version_lots" USING btree ("lot_id");
  ALTER TABLE "lots" DROP COLUMN "auction_id";`);
}
