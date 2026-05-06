import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVitalsTable1778033943174 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE vitals (
        id INT AUTO_INCREMENT PRIMARY KEY,

        date DATE NOT NULL,

        bloodPressureSystolic INT NULL,

        bloodPressureDiastolic INT NULL,

        heartRate INT NULL,

        bloodGlucose INT NULL,

        weight DECIMAL(5,2) NULL,

        sleepHours DECIMAL(3,1) NULL,

        status ENUM('NORMAL', 'WARNING', 'CRITICAL')
        NOT NULL DEFAULT 'NORMAL',

        createdAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

        userId INT NOT NULL,

        CONSTRAINT FK_VITAL_USER
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE,

        CONSTRAINT UQ_USER_DATE
        UNIQUE (userId, date)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE vitals
    `);
  }
}
