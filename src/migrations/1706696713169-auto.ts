import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1706696713169 implements MigrationInterface {
    name = 'Auto1706696713169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_b33dfe4d41ba6daa56352cdf365"`);
        await queryRunner.query(`CREATE TABLE "quiz_result" ("id" SERIAL NOT NULL, "correctAnswers" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "quizId" uuid, "companyId" uuid, CONSTRAINT "PK_87b85729df5cb6f6e136daeea4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quiz_result" ADD CONSTRAINT "FK_4abf6cd9299375deb44f23f170a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_result" ADD CONSTRAINT "FK_9220c1b7b2ecc84d5edb11abd88" FOREIGN KEY ("quizId") REFERENCES "quizz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_result" ADD CONSTRAINT "FK_0be22abe3418cf40abc24220ed8" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_b33dfe4d41ba6daa56352cdf365" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_b33dfe4d41ba6daa56352cdf365"`);
        await queryRunner.query(`ALTER TABLE "quiz_result" DROP CONSTRAINT "FK_0be22abe3418cf40abc24220ed8"`);
        await queryRunner.query(`ALTER TABLE "quiz_result" DROP CONSTRAINT "FK_9220c1b7b2ecc84d5edb11abd88"`);
        await queryRunner.query(`ALTER TABLE "quiz_result" DROP CONSTRAINT "FK_4abf6cd9299375deb44f23f170a"`);
        await queryRunner.query(`DROP TABLE "quiz_result"`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_b33dfe4d41ba6daa56352cdf365" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
