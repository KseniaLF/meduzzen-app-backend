import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1705660310480 implements MigrationInterface {
    name = 'Auto1705660310480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "status"`);
    }

}
