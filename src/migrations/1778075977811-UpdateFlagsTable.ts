import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFlagsTable1778075977811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE flags
      DROP FOREIGN KEY FK_FLAG_STAFF
    `);

    await queryRunner.query(`
      ALTER TABLE flags
      DROP COLUMN staffId
    `);

    await queryRunner.query(`
      ALTER TABLE flags
      ADD COLUMN sourceVitalId INT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE flags
      ADD CONSTRAINT FK_FLAG_SOURCE_VITAL
      FOREIGN KEY (sourceVitalId)
      REFERENCES vitals(id)
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE flags
      DROP FOREIGN KEY FK_FLAG_SOURCE_VITAL
    `);

    await queryRunner.query(`
      ALTER TABLE flags
      DROP COLUMN sourceVitalId
    `);

    await queryRunner.query(`
      ALTER TABLE flags
      ADD COLUMN staffId INT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE flags
      ADD CONSTRAINT FK_FLAG_STAFF
      FOREIGN KEY (staffId)
      REFERENCES users(id)
      ON DELETE SET NULL
    `);
  }
}
