import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/user.entity";

@Entity("streaks")
export class Streak {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0 })
  currentStreak!: number;

  @Column({ default: 0 })
  longestStreak!: number;

  @Column({ type: "date", nullable: true })
  lastLoggedDate?: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.streak, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user!: User;
}
