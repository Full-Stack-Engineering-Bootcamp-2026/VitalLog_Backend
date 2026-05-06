import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "../../user/user.entity";
import { Vital } from "../../vital/entity/vital.entity";

import {
  FLAG_SOURCE,
  FlagSourceType,
  FLAG_SEVERITY,
  FlagSeverityType,
  FLAG_STATUS,
  FlagStatusType,
} from "../../../common/constants/flag.constant";

@Entity("flags")
export class Flag {
  @PrimaryGeneratedColumn()
  id!: number;

  //what/ who triggered it
  @Column({
    type: "enum",
    enum: Object.values(FLAG_SOURCE),
    default: FLAG_SOURCE.SYSTEM,
  })
  source!: FlagSourceType;

  //flag reason
  @Column({ type: "text" })
  reason!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  category?: string;

  @Column({
    type: "enum",
    enum: Object.values(FLAG_SEVERITY),
    default: FLAG_SEVERITY.MEDIUM,
  })
  severity!: FlagSeverityType;

  @Column({
    type: "enum",
    enum: Object.values(FLAG_STATUS),
    default: FLAG_STATUS.OPEN,
  })
  status!: FlagStatusType;

  @ManyToOne(() => Vital, (vital) => vital.flags, {
    nullable: true,
    onDelete: "SET NULL",
  })
  sourceVital?: Vital;

  @Column({ type: "text", nullable: true })
  resolutionNote?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  raisedBy?: User;

  @ManyToOne(() => User, { nullable: true })
  resolvedBy?: User;

  //who is flagged ? that will show
  @ManyToOne(() => User, (user) => user.flags, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => User, { nullable: true })
  staff?: User;

  @Column({ type: "timestamp", nullable: true })
  resolvedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
