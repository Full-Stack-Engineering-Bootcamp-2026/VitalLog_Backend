import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/entity/user.entity";
import { GenderType, GENDER } from "../../../common/constants/gender.constants";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  age?: number;

  @Column({
    type: "enum",
    enum: Object.values(GENDER),
    nullable: true,
  })
  gender?: GenderType;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  height?: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  weight?: number;

  @Column({ type: "text", nullable: true })
  medicalConditions?: string;

  @Column({ type: "text", nullable: true })
  fitnessGoal?: string;

  @Column({ type: "text", nullable: true })
  profileImageUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user!: User;
}
