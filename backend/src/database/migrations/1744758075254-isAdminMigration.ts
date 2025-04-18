import { MigrationInterface, QueryRunner } from 'typeorm';

export class IsAdminMigration1744758075254 implements MigrationInterface {
  name = 'IsAdminMigration1744758075254';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "faculty" ADD "is_admin" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "faculty" DROP COLUMN "is_admin"`);
  }
}
