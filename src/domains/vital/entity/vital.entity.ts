import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from "typeorm";

import { User } from "../../user/user.entity";
import { Flag } from "../../flag/entity/flag.entity";
import {
  VITAL_TYPE,
  VitalTypeValue,
  RANGE_STATUS,
  RangeStatusType,
} from "../../../common/constants/vital.constant";

@Entity("vitals")
//1 user 1 vital per day
@Unique(["user", "vitalType", "loggedDate"])
export class Vital {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: Object.values(VITAL_TYPE),
  })
  vitalType!: VitalTypeValue;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  value?: number; // heart rate: bpm and weight :kg

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  systolicValue?: number; //blood_pressure only

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  diastolicValue?: number; //blood_pressure only

  @Column({ type: "varchar", length: 20, nullable: true })
  unit?: string;

  @Column({
    type: "enum",
    enum: Object.values(RANGE_STATUS),
    default: RANGE_STATUS.NORMAL,
  })
  status!: RangeStatusType;

  @Column({ type: "date" })
  loggedDate!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.vitals, {
    onDelete: "CASCADE",
  })
  user!: User;

  @OneToMany(() => Flag, (flag) => flag.sourceVital)
  flags!: Flag[];
}
