import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { ROLES, RoleType } from "../../../common/constants/roles.constants";
import { Profile } from "../../profile/entity/profile.entity";
import { Vital } from "../../vital/entity/vital.entity";
import { FitnessLog } from "../../fitness/entity/fitness.entity";
import { Flag } from "../../flag/entity/flag.entity";
import { Streak } from "../../streak/entity/streak.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({
    type: "enum",
    enum: Object.values(ROLES),
    default: ROLES.MEMBER,
  })
  role!: RoleType;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  mustChangePassword!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  resetToken?: string | null;

  @Column({ type: "datetime", nullable: true })
  resetTokenExpiry?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // relations
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @OneToMany(() => Vital, (vital) => vital.user)
  vitals!: Vital[];

  @OneToMany(() => FitnessLog, (f) => f.user)
  fitnessLogs!: FitnessLog[];

  @OneToMany(() => Flag, (flag) => flag.user)
  flags!: Flag[];

  @OneToOne(() => Streak, (streak) => streak.user)
  streak!: Streak;
}
