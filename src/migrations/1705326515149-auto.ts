import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1705326515149 implements MigrationInterface {
    name = 'Auto1705326515149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_ee87438803acb531639e8284be0"`);
        await queryRunner.query(`CREATE TABLE "user_actions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c8a683381b553ee59ce5b7b13a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_actions_company_participations_company" ("userActionsId" integer NOT NULL, "companyId" integer NOT NULL, CONSTRAINT "PK_879a5e24d13c5b0d28411844c0b" PRIMARY KEY ("userActionsId", "companyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4e17ce4776352f201080576767" ON "user_actions_company_participations_company" ("userActionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8afa24ddc28a5ceb644ce9a205" ON "user_actions_company_participations_company" ("companyId") `);
        await queryRunner.query(`CREATE TABLE "user_actions_company_invitations_company" ("userActionsId" integer NOT NULL, "companyId" integer NOT NULL, CONSTRAINT "PK_f7d82a8ecabce3cc4ce7aaf9a8d" PRIMARY KEY ("userActionsId", "companyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_01c2e7bafa083b5b3e2d225d94" ON "user_actions_company_invitations_company" ("userActionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_717fa2a7118644ec8fee24202f" ON "user_actions_company_invitations_company" ("companyId") `);
        await queryRunner.query(`CREATE TABLE "user_actions_company_requests_company" ("userActionsId" integer NOT NULL, "companyId" integer NOT NULL, CONSTRAINT "PK_e7129d43102ba45b36bf8c25a5a" PRIMARY KEY ("userActionsId", "companyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb88ffa95f8feafb9d3050083b" ON "user_actions_company_requests_company" ("userActionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_484647186231d30d3c00b94c97" ON "user_actions_company_requests_company" ("companyId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "actionsId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_a5a76049ead50e2d0b8a4a2cdd2" UNIQUE ("actionsId")`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_ee87438803acb531639e8284be0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a5a76049ead50e2d0b8a4a2cdd2" FOREIGN KEY ("actionsId") REFERENCES "user_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_participations_company" ADD CONSTRAINT "FK_4e17ce4776352f2010805767676" FOREIGN KEY ("userActionsId") REFERENCES "user_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_participations_company" ADD CONSTRAINT "FK_8afa24ddc28a5ceb644ce9a205f" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_invitations_company" ADD CONSTRAINT "FK_01c2e7bafa083b5b3e2d225d948" FOREIGN KEY ("userActionsId") REFERENCES "user_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_invitations_company" ADD CONSTRAINT "FK_717fa2a7118644ec8fee24202fb" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_requests_company" ADD CONSTRAINT "FK_eb88ffa95f8feafb9d3050083b7" FOREIGN KEY ("userActionsId") REFERENCES "user_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_requests_company" ADD CONSTRAINT "FK_484647186231d30d3c00b94c97a" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_actions_company_requests_company" DROP CONSTRAINT "FK_484647186231d30d3c00b94c97a"`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_requests_company" DROP CONSTRAINT "FK_eb88ffa95f8feafb9d3050083b7"`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_invitations_company" DROP CONSTRAINT "FK_717fa2a7118644ec8fee24202fb"`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_invitations_company" DROP CONSTRAINT "FK_01c2e7bafa083b5b3e2d225d948"`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_participations_company" DROP CONSTRAINT "FK_8afa24ddc28a5ceb644ce9a205f"`);
        await queryRunner.query(`ALTER TABLE "user_actions_company_participations_company" DROP CONSTRAINT "FK_4e17ce4776352f2010805767676"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a5a76049ead50e2d0b8a4a2cdd2"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_ee87438803acb531639e8284be0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_a5a76049ead50e2d0b8a4a2cdd2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "actionsId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_484647186231d30d3c00b94c97"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb88ffa95f8feafb9d3050083b"`);
        await queryRunner.query(`DROP TABLE "user_actions_company_requests_company"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_717fa2a7118644ec8fee24202f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01c2e7bafa083b5b3e2d225d94"`);
        await queryRunner.query(`DROP TABLE "user_actions_company_invitations_company"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8afa24ddc28a5ceb644ce9a205"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e17ce4776352f201080576767"`);
        await queryRunner.query(`DROP TABLE "user_actions_company_participations_company"`);
        await queryRunner.query(`DROP TABLE "user_actions"`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_ee87438803acb531639e8284be0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
