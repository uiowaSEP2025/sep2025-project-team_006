import { MigrationInterface, QueryRunner } from "typeorm";

export class FacultyLiked1746124546456 implements MigrationInterface {
    name = 'FacultyLiked1746124546456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD "liked" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "liked"`);
    }

}
