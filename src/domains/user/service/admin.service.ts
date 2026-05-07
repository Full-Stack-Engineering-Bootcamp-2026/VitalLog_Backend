import { Service } from "typedi";
import argon2 from "argon2";
import { UserRepository } from "../repository/user.repository";
import { ROLES } from "../../../common/constants/roles.constants";
import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { UnauthorizedException } from "../../../common/exceptions/unauthorized.exception";

import { AuthErrorMessages } from "../../../common/constants/auth-error-messages.constants";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { ChangePasswordRequestDto } from "../dto/auth.dto";
import { ForceResetPasswordRequestDto } from "../dto/auth.dto";
import { CreateStaffRequestDto } from "../dto/admin.dto";
import { StaffResponseDto } from "../dto/admin.dto";
import { EmailService } from "../../../common/services/email.service";
import crypto from "crypto";
@Service()
export class AdminService {
  constructor(
    private readonly repository: UserRepository,
    private readonly emailService: EmailService,
  ) {}
  public async createStaff(
    data: CreateStaffRequestDto,
  ): Promise<StaffResponseDto> {
    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException(AuthErrorMessages.EMAIL_ALREADY_REGISTERED);
    }
    //generate temp pass using crypto
    const tempPassword = crypto.randomBytes(6).toString("base64");

    console.log(tempPassword);
    //hash using argon2
    const hashedPassword = await argon2.hash(tempPassword, {
      type: argon2.argon2id,
    });

    const user = await this.repository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: ROLES.STAFF,
      isActive: true,
      mustChangePassword: true,
    });

    await this.emailService.sendStaffCredentialsEmail({
      to: user.email,
      name: user.name,
      temporaryPassword: tempPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
    };
  }
}
