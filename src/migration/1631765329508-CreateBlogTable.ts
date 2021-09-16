import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBlogTable1631765329508 implements MigrationInterface {
  name = 'CreateBlogTable1631765329508'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" character varying NOT NULL, "blobName" character varying NULL, "userId" uuid, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "lastActivity" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "blog" ADD CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d"`)
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "lastActivity"`)
    await queryRunner.query(`DROP TABLE "blog"`)
  }
}
