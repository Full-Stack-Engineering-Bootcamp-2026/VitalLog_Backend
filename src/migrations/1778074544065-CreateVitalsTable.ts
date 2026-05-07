import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVitalsTable1778074544065 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE vitals (
        id INT AUTO_INCREMENT PRIMARY KEY,

        vitalType ENUM(
          'HEART_RATE',
          'BLOOD_PRESSURE',
          'BLOOD_GLUCOSE',
          'WEIGHT',
          'SLEEP'
        ) NOT NULL,

        value DECIMAL(6,2) NULL,

        systolicValue DECIMAL(5,2) NULL,

        diastolicValue DECIMAL(5,2) NULL,

        unit VARCHAR(20) NULL,

        status ENUM(
          'NORMAL',
          'WARNING',
          'CRITICAL'
        ) NOT NULL DEFAULT 'NORMAL',

        loggedDate DATE NOT NULL,

        createdAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

        updatedAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

        userId INT NOT NULL,

        CONSTRAINT FK_VITAL_USER
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE,

        CONSTRAINT UQ_USER_VITAL_DATE
        UNIQUE (
          userId,
          vitalType,
          loggedDate
        )
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE vitals
    `);
  }
}
