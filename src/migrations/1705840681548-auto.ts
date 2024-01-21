import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1705840681548 implements MigrationInterface {
    name = 'Auto1705840681548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL DEFAULT 'Content', "status" character varying NOT NULL DEFAULT 'pending', "ownerId" uuid, "companyId" uuid, CONSTRAINT "PK_5a8702f28aa636f59038532bb85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_request" ADD CONSTRAINT "FK_da8a05dd0bae8e2ce036ee6819f" FOREIGN KEY ("ownerId") REFERENCES "user_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_request" ADD CONSTRAINT "FK_a6f9c33f89da5eee52354f780c3" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_request" DROP CONSTRAINT "FK_a6f9c33f89da5eee52354f780c3"`);
        await queryRunner.query(`ALTER TABLE "user_request" DROP CONSTRAINT "FK_da8a05dd0bae8e2ce036ee6819f"`);
        await queryRunner.query(`DROP TABLE "user_request"`);
    }

}
