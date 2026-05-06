import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFitnessLogsTable1778034194304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE fitness_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,

        activityType VARCHAR(100) NOT NULL,

        duration INT NOT NULL,

        caloriesBurned INT NOT NULL,

        date DATE NOT NULL,

        notes TEXT NULL,

        createdAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

        userId INT NOT NULL,

        CONSTRAINT FK_FITNESS_USER
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE fitness_logs
    `);
  }
}
