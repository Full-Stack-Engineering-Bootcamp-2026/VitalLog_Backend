import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { ROLES, RoleType } from "../../common/constants/roles.constants";
import { Profile } from "../profile/profile.entity";
import { Vital } from "../vital/vital.entity";
import { FitnessLog } from "../fitness/fitness.entity";
import { Flag } from "../flag/flag.entity";
import { Streak } from "../streak/streak.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, select: false })
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

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ type: "datetime", nullable: true })
  resetTokenExpiry?: Date;

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
