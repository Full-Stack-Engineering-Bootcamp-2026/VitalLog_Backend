import { RoleType } from "../../../common/constants/roles.constants";

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponseDto {
  user: UserResponseDto;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  //  mustChangePassword: boolean;
  user: UserResponseDto;
}

export interface JwtPayloadDto {
  id: number;
  email: string;
  role: RoleType;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export interface ForceResetPasswordRequestDto {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
