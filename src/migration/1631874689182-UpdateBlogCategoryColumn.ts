import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateBlogCategoryColumn1631874689182 implements MigrationInterface {
  name = 'UpdateBlogCategoryColumn1631874689182'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."blog" ADD "category" character varying NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."blog" DROP COLUMN "category"`)
  }
}
