import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubmitReview1743971321922 implements MigrationInterface {
  name = 'SubmitReview1743971321922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD "submitted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "submitted"`);
  }
}
