import { MigrationInterface, QueryRunner } from "typeorm";

export class TemplateMigration1744159047145 implements MigrationInterface {
    name = 'TemplateMigration1744159047145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "template_metrics" ("template_metric_id" SERIAL NOT NULL, "metric_name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "metric_weight" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "templateTemplateId" integer, CONSTRAINT "PK_655384dbcdc345fdb85dda4f207" PRIMARY KEY ("template_metric_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."templates_department_enum" AS ENUM('BME', 'CBE', 'CEE', 'ECE', 'ISE', 'ME', 'None')`);
        await queryRunner.query(`CREATE TABLE "templates" ("template_id" SERIAL NOT NULL, "department" "public"."templates_department_enum" NOT NULL DEFAULT 'None', "name" character varying NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cfafdab99c9325e084ebb3f8aa0" PRIMARY KEY ("template_id"))`);
        await queryRunner.query(`ALTER TABLE "template_metrics" ADD CONSTRAINT "FK_51e95219d2e9d33d26ef74174e9" FOREIGN KEY ("templateTemplateId") REFERENCES "templates"("template_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_metrics" DROP CONSTRAINT "FK_51e95219d2e9d33d26ef74174e9"`);
        await queryRunner.query(`DROP TABLE "templates"`);
        await queryRunner.query(`DROP TYPE "public"."templates_department_enum"`);
        await queryRunner.query(`DROP TABLE "template_metrics"`);
    }

}
