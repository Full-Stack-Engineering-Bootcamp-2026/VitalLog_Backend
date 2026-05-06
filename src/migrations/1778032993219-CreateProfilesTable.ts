import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfilesTable1778032993219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,

        age INT NULL,

        gender ENUM('MALE', 'FEMALE', 'OTHER') NULL,

        height DECIMAL(5,2) NULL,

        weight DECIMAL(5,2) NULL,

        medicalConditions TEXT NULL,

        fitnessGoal TEXT NULL,

        profileImageUrl TEXT NULL,

        createdAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

        updatedAt TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

        userId INT NOT NULL UNIQUE,  

        CONSTRAINT FK_PROFILE_USER
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE profiles
    `);
  }
}
