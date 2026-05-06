import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import {
  FLAG_SOURCE,
  FlagSourceType,
  FLAG_SEVERITY,
  FlagSeverityType,
  FLAG_STATUS,
  FlagStatusType,
} from "../../common/constants/flag.constant";

@Entity("flags")
export class Flag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: Object.values(FLAG_SOURCE),
    default: FLAG_SOURCE.SYSTEM,
  })
  source!: FlagSourceType;

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

  @Column({ type: "text", nullable: true })
  resolutionNote?: string;

  @Column({ type: "timestamp", nullable: true })
  resolvedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.flags)
  user!: User;

  @ManyToOne(() => User, { nullable: true })
  staff?: User;

  @ManyToOne(() => User, { nullable: true })
  resolvedBy?: User;
}
