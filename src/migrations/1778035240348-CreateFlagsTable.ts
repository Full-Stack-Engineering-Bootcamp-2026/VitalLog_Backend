import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFlagsTable1778035240348 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE flags (
        id INT AUTO_INCREMENT PRIMARY KEY,

        source ENUM('SYSTEM', 'MANUAL')
        NOT NULL DEFAULT 'SYSTEM',

        reason TEXT NOT NULL,

        category VARCHAR(100) NULL,

        severity ENUM('LOW', 'MEDIUM', 'HIGH')
        NOT NULL DEFAULT 'MEDIUM',

        status ENUM('OPEN', 'RESOLVED')
        NOT NULL DEFAULT 'OPEN',

        resolutionNote TEXT NULL,

        resolvedAt TIMESTAMP NULL,

        createdAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

        userId INT NOT NULL,

        staffId INT NULL,

        resolvedById INT NULL,

        CONSTRAINT FK_FLAG_USER
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE,

        CONSTRAINT FK_FLAG_STAFF
        FOREIGN KEY (staffId)
        REFERENCES users(id)
        ON DELETE SET NULL,

        CONSTRAINT FK_FLAG_RESOLVED_BY
        FOREIGN KEY (resolvedById)
        REFERENCES users(id)
        ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE flags
    `);
  }
}
