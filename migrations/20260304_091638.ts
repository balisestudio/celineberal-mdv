import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "estimates" ALTER COLUMN "civility" SET DATA TYPE text;
  DROP TYPE "public"."enum_estimates_civility";
  CREATE TYPE "public"."enum_estimates_civility" AS ENUM('woman', 'man', 'other');
  ALTER TABLE "estimates" ALTER COLUMN "civility" SET DATA TYPE "public"."enum_estimates_civility" USING "civility"::"public"."enum_estimates_civility";`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "estimates" ALTER COLUMN "civility" SET DATA TYPE text;
  DROP TYPE "public"."enum_estimates_civility";
  CREATE TYPE "public"."enum_estimates_civility" AS ENUM('madame', 'monsieur', 'autre');
  ALTER TABLE "estimates" ALTER COLUMN "civility" SET DATA TYPE "public"."enum_estimates_civility" USING "civility"::"public"."enum_estimates_civility";`);
}
