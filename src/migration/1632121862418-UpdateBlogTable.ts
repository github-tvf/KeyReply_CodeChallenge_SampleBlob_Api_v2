import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateBlogTable1632121862418 implements MigrationInterface {
  name = 'UpdateBlogTable1632121862418'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."blog" ADD "thumbnail" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."blog" DROP COLUMN "thumbnail"`)
  }
}
