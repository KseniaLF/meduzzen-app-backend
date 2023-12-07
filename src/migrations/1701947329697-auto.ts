import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1701947329697 implements MigrationInterface {
    name = 'Auto1701947329697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "REL_373ead146f110f04dad6084815"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "authId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6" UNIQUE ("authId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authId"`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "REL_373ead146f110f04dad6084815" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
