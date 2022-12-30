import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDatabaseBaseTable1672380439346
  implements MigrationInterface
{
  name = 'createDatabaseBaseTable1672380439346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "demo"."roles" ("id" integer NOT NULL, "name" character varying(100) NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "demo"."users" ("id" SERIAL NOT NULL, "first_name" character varying(100), "last_name" character varying(100), "name" character varying(100), "email" character varying(100) NOT NULL, "mobile" character varying(100), "password" character varying(255) NOT NULL, "status" boolean DEFAULT false, "role_id" integer NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "demo"."codes" ("id" SERIAL NOT NULL, "code" character varying(100), "user_id" integer NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_9b85c624e2d705f4e8a9b64dbf4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "demo"."users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "demo"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demo"."codes" ADD CONSTRAINT "FK_4faaad086955b535c6fe27dbdf2" FOREIGN KEY ("user_id") REFERENCES "demo"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "demo"."codes" DROP CONSTRAINT "FK_4faaad086955b535c6fe27dbdf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demo"."users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(`DROP TABLE "demo"."codes"`);
    await queryRunner.query(`DROP TABLE "demo"."users"`);
    await queryRunner.query(`DROP TABLE "demo"."roles"`);
  }
}
