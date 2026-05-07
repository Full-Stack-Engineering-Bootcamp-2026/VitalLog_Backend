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

@Service()
export class AuthService {
  constructor(private readonly repository: UserRepository) {}

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
}
