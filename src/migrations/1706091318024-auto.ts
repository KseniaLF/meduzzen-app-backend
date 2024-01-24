import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1706091318024 implements MigrationInterface {
  name = 'Auto1706091318024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."company_status_enum" RENAME TO "company_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."company_status_enum" AS ENUM('private', 'public')`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "status" TYPE "public"."company_status_enum" USING "status"::"text"::"public"."company_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "status" SET DEFAULT 'public'`,
    );
    await queryRunner.query(`DROP TYPE "public"."company_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."company_status_enum_old" AS ENUM('private', 'inactive')`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "status" TYPE "public"."company_status_enum_old" USING "status"::"text"::"public"."company_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "status" SET DEFAULT 'inactive'`,
    );
    await queryRunner.query(`DROP TYPE "public"."company_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."company_status_enum_old" RENAME TO "company_status_enum"`,
    );
  }
}
