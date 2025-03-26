import { MigrationInterface, QueryRunner } from 'typeorm';

export class SepMigration1742870212107 implements MigrationInterface {
  name = 'SepMigration1742870212107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "new_path"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "new_path" character varying`,
    );
  }
}
