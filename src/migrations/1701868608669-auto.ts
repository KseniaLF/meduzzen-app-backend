import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1701868608669 implements MigrationInterface {
  name = 'Auto1701868608669';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying NOT NULL`,
    );
  }
}
