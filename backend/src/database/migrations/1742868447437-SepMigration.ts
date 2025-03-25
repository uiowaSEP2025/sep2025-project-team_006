import { MigrationInterface, QueryRunner } from "typeorm";

export class SepMigration1742868447437 implements MigrationInterface {
    name = 'SepMigration1742868447437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students" ("student_id" SERIAL NOT NULL, "first_name" character varying, "last_name" character varying, "phone_number" character varying, "address" character varying, CONSTRAINT "PK_ba36f3e3743f80d1cdc51020103" PRIMARY KEY ("student_id"))`);
        await queryRunner.query(`CREATE TABLE "faculty_metrics" ("faculty_metric_id" SERIAL NOT NULL, "metric_name" character varying NOT NULL, "description" character varying NOT NULL, "default_weight" double precision NOT NULL, "facultyFacultyId" integer, CONSTRAINT "PK_4273821bf85955ed7ab3004d976" PRIMARY KEY ("faculty_metric_id"))`);
        await queryRunner.query(`CREATE TABLE "faculty" ("faculty_id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "department" character varying NOT NULL, "job_title" character varying NOT NULL, CONSTRAINT "PK_8339473e71533d4789bccccca06" PRIMARY KEY ("faculty_id"))`);
        await queryRunner.query(`CREATE TABLE "review_metrics" ("review_metric_id" SERIAL NOT NULL, "name" character varying, "description" character varying, "selected_weight" double precision NOT NULL, "value" double precision NOT NULL, "reviewReviewId" integer, CONSTRAINT "PK_edd525b583f652a065e83b6387d" PRIMARY KEY ("review_metric_id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("review_id" SERIAL NOT NULL, "overall_score" integer, "review_date" TIMESTAMP NOT NULL DEFAULT now(), "comments" text, "applicationApplicationId" integer, "facultyFacultyId" integer, CONSTRAINT "PK_bfe951d9dca4ba99674c5772905" PRIMARY KEY ("review_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."documents_document_type_enum" AS ENUM('pdf', 'xlsx')`);
        await queryRunner.query(`CREATE TABLE "documents" ("document_id" SERIAL NOT NULL, "document_type" "public"."documents_document_type_enum" NOT NULL, "file_path" character varying NOT NULL, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "new_path" character varying, "applicationApplicationId" integer, CONSTRAINT "PK_bec3c89789f76e330bbe1766b2c" PRIMARY KEY ("document_id"))`);
        await queryRunner.query(`CREATE TABLE "applications" ("application_id" SERIAL NOT NULL, "status" character varying NOT NULL, "submission_date" TIMESTAMP NOT NULL DEFAULT now(), "department" character varying NOT NULL, "degree_program" character varying NOT NULL, "studentStudentId" integer, CONSTRAINT "PK_418038704e50c663590feb7f511" PRIMARY KEY ("application_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_account_type_enum" AS ENUM('faculty', 'student')`);
        await queryRunner.query(`CREATE TYPE "public"."users_provider_enum" AS ENUM('none', 'Google', 'Microsoft')`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "account_type" "public"."users_account_type_enum" NOT NULL DEFAULT 'student', "provider" "public"."users_provider_enum" NOT NULL DEFAULT 'none', "provider_id" character varying, "email" character varying NOT NULL, "password_digest" character varying NOT NULL, "registered_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "student_id" integer, "faculty_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "CHK_0fb781a5747bfef7c21722916f" CHECK (("student_id" IS NOT NULL AND "faculty_id" IS NULL) OR ("student_id" IS NULL AND "faculty_id" IS NOT NULL)), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "session_token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" integer, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tests" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4301ca51edf839623386860aed2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "faculty_metrics" ADD CONSTRAINT "FK_379ae17f136c3ee0576bd97342f" FOREIGN KEY ("facultyFacultyId") REFERENCES "faculty"("faculty_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review_metrics" ADD CONSTRAINT "FK_ba403e3de06099143ee9c644dc5" FOREIGN KEY ("reviewReviewId") REFERENCES "reviews"("review_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_da90013410e1941677a18fc2b4c" FOREIGN KEY ("applicationApplicationId") REFERENCES "applications"("application_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_dcc5eb4cd292c495857a94831ba" FOREIGN KEY ("facultyFacultyId") REFERENCES "faculty"("faculty_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_7a5dcbe1041b7b9b708eb97ea51" FOREIGN KEY ("applicationApplicationId") REFERENCES "applications"("application_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_a9fccb67946c7e3daf7837f336c" FOREIGN KEY ("studentStudentId") REFERENCES "students"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4bcc4fd204f448ad671c0747ab4" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a0842240f363f156f8ee9377fad" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("faculty_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_1717a0d4e993dc7e9497696c029" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_1717a0d4e993dc7e9497696c029"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a0842240f363f156f8ee9377fad"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4bcc4fd204f448ad671c0747ab4"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_a9fccb67946c7e3daf7837f336c"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_7a5dcbe1041b7b9b708eb97ea51"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_dcc5eb4cd292c495857a94831ba"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_da90013410e1941677a18fc2b4c"`);
        await queryRunner.query(`ALTER TABLE "review_metrics" DROP CONSTRAINT "FK_ba403e3de06099143ee9c644dc5"`);
        await queryRunner.query(`ALTER TABLE "faculty_metrics" DROP CONSTRAINT "FK_379ae17f136c3ee0576bd97342f"`);
        await queryRunner.query(`DROP TABLE "tests"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_account_type_enum"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TYPE "public"."documents_document_type_enum"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "review_metrics"`);
        await queryRunner.query(`DROP TABLE "faculty"`);
        await queryRunner.query(`DROP TABLE "faculty_metrics"`);
        await queryRunner.query(`DROP TABLE "students"`);
    }

}
