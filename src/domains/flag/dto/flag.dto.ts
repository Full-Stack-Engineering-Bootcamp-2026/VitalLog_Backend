import {
  FlagSourceType,
  FlagSeverityType,
  FlagStatusType,
} from "../../../common/constants/flag.constant";

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateManualFlagRequestDto {
  userId: number;
  reason: string;
  severity: FlagSeverityType;
  category?: string;
}

export interface ResolveFlagRequestDto {
  resolutionNote?: string;
}

export interface FlagQueryDto {
  status?: string;
  source?: string;
  page?: string;
  limit?: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface FlaggedUserDto {
  id: number;
  name: string;
  email: string;
}

export interface FlagResponseDto {
  id: number;
  source: FlagSourceType;
  reason: string;
  category?: string;
  severity: FlagSeverityType;
  status: FlagStatusType;
  resolutionNote?: string;
  resolvedAt?: Date;
  createdAt: Date;
  user: FlaggedUserDto;
  resolvedBy?: FlaggedUserDto;
  sourceVitalId?: number;
}

export interface PaginatedFlagsResponseDto {
  data: FlagResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
