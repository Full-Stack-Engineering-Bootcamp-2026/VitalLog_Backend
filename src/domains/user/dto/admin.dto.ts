import { RoleType } from "../../../common/constants/roles.constants";

export interface CreateStaffRequestDto {
  name: string;
  email: string;
}

export interface MemberResponseDto {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  isActive: boolean;
  createdAt: Date;
}

export interface StaffResponseDto {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
}
export interface RegistrationTrendItemDto {
  date: string;
  count: number;
}

export interface RegistrationTrendResponseDto {
  days: RegistrationTrendItemDto[];
}
export interface FlaggedVitalsDistributionItemDto {
  vitalType: string;
  count: number;
}

export interface FlaggedVitalsDistributionResponseDto {
  items: FlaggedVitalsDistributionItemDto[];
}
