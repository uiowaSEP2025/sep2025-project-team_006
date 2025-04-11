import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReviewTemplateMigration1744332306433
  implements MigrationInterface
{
  name = 'ReviewTemplateMigration1744332306433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review_metrics" RENAME COLUMN "description" TO "template_weight"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD "templateTemplateId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_metrics" DROP COLUMN "template_weight"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_metrics" ADD "template_weight" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_1c900663fd5bbd8a91a22cca3c9" FOREIGN KEY ("templateTemplateId") REFERENCES "templates"("template_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_1c900663fd5bbd8a91a22cca3c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_metrics" DROP COLUMN "template_weight"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_metrics" ADD "template_weight" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP COLUMN "templateTemplateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_metrics" RENAME COLUMN "template_weight" TO "description"`,
    );
  }
}
