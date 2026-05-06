import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../../user/user.entity";

@Entity("fitness_logs")
export class FitnessLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  activityType!: string;

  @Column()
  duration!: number;

  @Column()
  caloriesBurned!: number;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.fitnessLogs, {
    onDelete: "CASCADE",
  })
  user!: User;
}
