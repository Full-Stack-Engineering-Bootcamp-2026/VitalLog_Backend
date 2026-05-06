import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStreaksTable1778035113582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE streaks (
        id INT AUTO_INCREMENT PRIMARY KEY,

        currentStreak INT NOT NULL DEFAULT 0,

        longestStreak INT NOT NULL DEFAULT 0,

        lastLoggedDate DATE NULL,

        updatedAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

        userId INT NOT NULL UNIQUE,

        CONSTRAINT FK_STREAK_USER
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE streaks
    `);
  }
}
