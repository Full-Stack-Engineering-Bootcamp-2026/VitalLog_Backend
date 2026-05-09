import { Service } from "typedi";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repository/user.repository";

import {
  RegisterRequestDto,
  RegisterResponseDto,
  LoginRequestDto,
  AuthResponseDto,
  UserResponseDto,
} from "../dto/auth.dto";

import { ROLES } from "../../../common/constants/roles.constants";

import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { UnauthorizedException } from "../../../common/exceptions/unauthorized.exception";

import { AuthErrorMessages } from "../../../common/constants/auth-error-messages.constants";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { ChangePasswordRequestDto } from "../dto/auth.dto";
import { ForceResetPasswordRequestDto } from "../dto/auth.dto";
import { EmailService } from "../../../common/services/email.service";
import { ForgotPasswordRequestDto } from "../dto/auth.dto";
import { ResetPasswordRequestDto } from "../dto/auth.dto";
import crypto from "crypto";
import { ProfileRepository } from "../../profile/repository/profile.repository";
@Service()
export class AuthService {
  constructor(
    private readonly repository: UserRepository,
    private readonly emailService: EmailService,
    private readonly profileRepository: ProfileRepository,
  ) {}

  public async register(
    data: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException(AuthErrorMessages.EMAIL_ALREADY_REGISTERED);
    }

    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
    });

    const user = await this.repository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: ROLES.MEMBER,
      isActive: true,
      mustChangePassword: false,
    });

    await this.profileRepository.create({
      user,
    });

    const responseUser: UserResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: responseUser,
    };
  }
  //auth response dto sends access token and user response
  public async login(data: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.repository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException(AuthErrorMessages.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(AuthErrorMessages.ACCOUNT_DEACTIVATED);
    }

    const isPasswordValid = await argon2.verify(user.password, data.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthErrorMessages.INVALID_CREDENTIALS);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new NotFoundException("token doesnt exist");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      },
    );

    const responseUser: UserResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken,
      user: responseUser,
    };
  }

  //change password
  public async changePassword(
    userId: number,
    data: ChangePasswordRequestDto,
  ): Promise<void> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      data.currentPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthErrorMessages.INVALID_CREDENTIALS);
    }

    const hashedPassword = await argon2.hash(data.newPassword, {
      type: argon2.argon2id,
    });

    await this.repository.update(user.id, {
      password: hashedPassword,
    });
  }

  //force reset

  public async forceResetPassword(
    userId: number,
    data: ForceResetPasswordRequestDto,
  ): Promise<void> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }
    //only if mustChangePass is true
    if (!user.mustChangePassword) {
      throw new BadRequestException("Password reset is not required");
    }

    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
    });

    await this.repository.update(user.id, {
      password: hashedPassword,
      mustChangePassword: false,
    });
  }

  public async me(userId: number): Promise<UserResponseDto> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  //forgot password
  public async forgotPassword(data: ForgotPasswordRequestDto): Promise<void> {
    const user = await this.repository.findByEmail(data.email);

    if (!user) {
      throw new NotFoundException("user does not exist");
    }
    //generated random string as reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    //expiry 10 min
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 10); //10 min current timestamp in ms and then store in date obj

    await this.repository.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await this.emailService.sendForgotPasswordEmail({
      to: user.email,
      name: user.name,
      resetLink,
    });
  }
  //token generate ,email sent ,reset link is there

  //reset password
  public async resetPassword(data: ResetPasswordRequestDto): Promise<void> {
    const user = await this.repository.findByResetToken(data.resetToken);

    if (!user) {
      throw new BadRequestException("Invalid reset token");
    }

    if (!user.resetTokenExpiry) {
      throw new BadRequestException("Reset token is missing");
    }

    if (user.resetTokenExpiry < new Date()) {
      throw new BadRequestException("Reset token is expired");
    }

    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
    });

    await this.repository.update(user.id, {
      password: hashedPassword,
      //clear token
      resetToken: null,

      resetTokenExpiry: null,
    });
  }
}
