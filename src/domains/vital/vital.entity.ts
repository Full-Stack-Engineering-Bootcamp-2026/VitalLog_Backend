import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { User } from "../user/user.entity";
import {
  VitalStatusType,
  VITAL_STATUS,
} from "../../common/constants/vital.constant";

@Entity("vitals")
//1 user 1 vital per day
@Unique(["user", "date"])
export class Vital {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.vitals, {
    onDelete: "CASCADE",
  })
  user!: User;

  @Column({ type: "date" })
  date!: string;

  @Column({ nullable: true })
  bloodPressureSystolic?: number;

  @Column({ nullable: true })
  bloodPressureDiastolic?: number;

  @Column({ nullable: true })
  heartRate?: number;

  @Column({ nullable: true })
  bloodGlucose?: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  weight?: number;

  @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
  sleepHours?: number;

  @Column({
    type: "enum",
    enum: Object.values(VITAL_STATUS),
    default: VITAL_STATUS.NORMAL,
  })
  status!: VitalStatusType;

  @CreateDateColumn()
  createdAt!: Date;
}
