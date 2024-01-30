import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1706606547648 implements MigrationInterface {
    name = 'Auto1706606547648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answerText" character varying NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "questionId" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "quizzId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "frequencyDays" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, "companyId" uuid, CONSTRAINT "PK_6fbd9c6f5884207789cd89e8d00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_354e21261519e8abbd5cff8b438" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_b33dfe4d41ba6daa56352cdf365" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_52355119be2525af4969aae34d8" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_52355119be2525af4969aae34d8"`);
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_b33dfe4d41ba6daa56352cdf365"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_354e21261519e8abbd5cff8b438"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`DROP TABLE "quizz"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "answer"`);
    }

}
