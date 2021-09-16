import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateBlogTable1631770574748 implements MigrationInterface {
  name = 'UpdateBlogTable1631770574748'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."blog" ADD "originalName" character varying`)
    await queryRunner.query(`ALTER TABLE "public"."blog" ADD "mimeType" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."blog" DROP COLUMN "mimeType"`)
    await queryRunner.query(`ALTER TABLE "public"."blog" DROP COLUMN "originalName"`)
  }
}
