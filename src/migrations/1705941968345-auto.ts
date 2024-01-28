import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1705941968345 implements MigrationInterface {
    name = 'Auto1705941968345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "status" "public"."company_status_enum" NOT NULL DEFAULT 'inactive', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authId" uuid, "actionsId" uuid, CONSTRAINT "REL_ad5065ee18a722baaa932d1c3c" UNIQUE ("authId"), CONSTRAINT "REL_a5a76049ead50e2d0b8a4a2cdd" UNIQUE ("actionsId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL DEFAULT 'Content', "status" character varying NOT NULL DEFAULT 'pending', "userId" uuid, "ownerId" uuid, "companyId" uuid, CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL DEFAULT 'Content', "status" character varying NOT NULL DEFAULT 'pending', "ownerId" uuid, "companyId" uuid, CONSTRAINT "PK_5a8702f28aa636f59038532bb85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_actions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c8a683381b553ee59ce5b7b13a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_actions_company_participations_company" ("userActionsId" uuid NOT NULL, "companyId" uuid NOT NULL, CONSTRAINT "PK_879a5e24d13c5b0d28411844c0b" PRIMARY KEY ("userActionsId", "companyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4e17ce4776352f201080576767" ON "user_actions_company_participations_company" ("userActionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8afa24ddc28a5ceb644ce9a205" ON "user_actions_company_participations_company" ("companyId") `);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_ee87438803acb531639e8284be0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a5a76049ead50e2d0b8a4a2cdd2" FOREIGN KEY ("actionsId") REFERENCES "user_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_05191060fae5b5485327709be7f" FOREIGN KEY ("userId") REFERENCES "user_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_a567faec45e663d2d89e3feb517" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_757968494b8501e4e3b27860fb0" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_request" ADD CONSTRAINT "FK_da8a05dd0bae8e2ce036ee6819f" FOREIGN KEY ("ownerId") REFERENCES "user_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_request" ADD CONSTRAINT "FK_a6f9c33f89da5eee52354f780c3" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_participations_company" ADD CONSTRAINT "FK_4e17ce4776352f2010805767676" FOREIGN KEY ("userActionsId") REFERENCES "user_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_participations_company" ADD CONSTRAINT "FK_8afa24ddc28a5ceb644ce9a205f" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_actions_company_participations_company" DROP CONSTRAINT "FK_8afa24ddc28a5ceb644ce9a205f"`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_participations_company" DROP CONSTRAINT "FK_4e17ce4776352f2010805767676"`);
        await queryRunner.query(`ALTER TABLE "user_request" DROP CONSTRAINT "FK_a6f9c33f89da5eee52354f780c3"`);
        await queryRunner.query(`ALTER TABLE "user_request" DROP CONSTRAINT "FK_da8a05dd0bae8e2ce036ee6819f"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_757968494b8501e4e3b27860fb0"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_a567faec45e663d2d89e3feb517"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_05191060fae5b5485327709be7f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a5a76049ead50e2d0b8a4a2cdd2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_ee87438803acb531639e8284be0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8afa24ddc28a5ceb644ce9a205"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e17ce4776352f201080576767"`);
        await queryRunner.query(`DROP TABLE "user_actions_company_participations_company"`);
        await queryRunner.query(`DROP TABLE "user_actions"`);
        await queryRunner.query(`DROP TABLE "user_request"`);
        await queryRunner.query(`DROP TABLE "invitation"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
