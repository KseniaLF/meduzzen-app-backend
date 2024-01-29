import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1706532992835 implements MigrationInterface {
    name = 'Auto1706532992835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."participant_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."participant_role_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_5fc927ee4f2e0b340d7ebad147e" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_5fc927ee4f2e0b340d7ebad147e"`);
        await queryRunner.query(`DROP TABLE "participant"`);
        await queryRunner.query(`DROP TYPE "public"."participant_role_enum"`);
    }

}
