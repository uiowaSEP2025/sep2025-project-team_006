import { MigrationInterface, QueryRunner } from 'typeorm';

export class GPAStandardization1745524012970 implements MigrationInterface {
  name = 'GPAStandardization1745524012970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" ADD "school" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD "original_gpa" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD "original_scale" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD "standardized_gpa" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP COLUMN "standardized_gpa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" DROP COLUMN "original_scale"`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" DROP COLUMN "original_gpa"`,
    );
    await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "school"`);
  }
}
