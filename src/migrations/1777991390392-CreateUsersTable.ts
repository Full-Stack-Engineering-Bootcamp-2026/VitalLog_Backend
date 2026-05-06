import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1777991390392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,

        name VARCHAR(100) NOT NULL,

        email VARCHAR(150) NOT NULL UNIQUE,

        password VARCHAR(255) NOT NULL,

        role ENUM('ADMIN', 'STAFF', 'MEMBER')
        NOT NULL DEFAULT 'MEMBER',

        isActive BOOLEAN NOT NULL DEFAULT TRUE,

        mustChangePassword BOOLEAN
        NOT NULL DEFAULT FALSE,

        resetToken VARCHAR(255) NULL,

        resetTokenExpiry DATETIME NULL,

        createdAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

        updatedAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE users
    `);
  }
}
