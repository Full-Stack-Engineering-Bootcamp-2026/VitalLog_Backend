import { FlagSeverityType } from "../../../common/constants/flag.constant";
import { FlagSourceType } from "../../../common/constants/flag.constant";
import { FlagStatusType } from "../../../common/constants/flag.constant";
import { RoleType } from "../../../common/constants/roles.constants";
export interface CreateManualFlagRequestDto {
  userId: number;
  sourceVitalId?: number;
  reason: string;
  category?: string;
  severity: FlagSeverityType;
}
export interface FlagVitalResponseDto {
  id: number;
  vitalType: string;
  value?: number | null;
  systolicValue?: number | null;
  diastolicValue?: number | null;
  unit?: string | null;
  status: string;
  loggedDate: string;
}
export interface FlagUserResponseDto {
  id: number;
  name: string;
  email: string;
  role: RoleType;
}
export interface CreateFlagResponseDto {
  id: number;
  source: FlagSourceType;
  reason: string;
  category?: string | null;
  severity: FlagSeverityType;
  status: FlagStatusType;
  resolutionNote?: string | null;
  resolvedAt?: Date | null;
  createdAt: Date;

  user: FlagUserResponseDto;
  sourceVital?: FlagVitalResponseDto | null;
}
export interface ResolveFlagRequestDto {
  resolutionNote: string;
}

export interface ResolveFlagResponseDto {
  id: number;
  status: FlagStatusType;
  resolutionNote: string;
  resolvedAt: Date;

  resolvedBy: FlagUserResponseDto;
}
///api/v1/flags?page=1&limit=5&status=RESOLVED
export interface GetFlagsRequestDto {
  page: number;
  limit: number;
  status?: FlagStatusType;
  search?: string;
}
export interface FlagListItemResponseDto {
  id: number;
  source: FlagSourceType;
  reason: string;
  category?: string | null;
  severity: FlagSeverityType;
  status: FlagStatusType;
  createdAt: Date;
  resolvedAt?: Date | null;

  user: {
    id: number;
    name: string;
    email: string;
  };

  resolvedBy?: {
    id: number;
    name: string;
    email: string;
  } | null;
}
export interface GetFlagsResponseDto {
  flags: FlagListItemResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
