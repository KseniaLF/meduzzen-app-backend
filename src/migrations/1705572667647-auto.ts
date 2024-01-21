import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1705572667647 implements MigrationInterface {
    name = 'Auto1705572667647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_a567faec45e663d2d89e3feb517" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_a567faec45e663d2d89e3feb517"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "ownerId"`);
    }

}
