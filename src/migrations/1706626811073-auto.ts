import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1706626811073 implements MigrationInterface {
  name = 'Auto1706626811073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_354e21261519e8abbd5cff8b438"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_354e21261519e8abbd5cff8b438" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_354e21261519e8abbd5cff8b438"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_354e21261519e8abbd5cff8b438" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
