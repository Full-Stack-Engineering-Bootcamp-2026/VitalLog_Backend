import { RoleType } from "../../../common/constants/roles.constants";
export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  token: string;
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

export interface AuthResponseDto {
  token: string;
  mustChangePassword: boolean;
  user: UserResponseDto;
}

export interface JwtPayloadDto {
  id: number;
  email: string;
  role: RoleType;
}
