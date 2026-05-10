export interface RaiseFlagRequestDto {
  userId: number;
  reason: string;
  category?: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface ResolveFlagRequestDto {
  resolutionNote: string;
}

export interface FlagResponseDto {
  id: number;
  reason: string;
  category?: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "RESOLVED";
  resolutionNote?: string;
  createdAt: Date;
  resolvedAt?: Date;
}
export interface GetStaffMembersRequestDto {
  page: number;
  limit: number;
  search?: string;
}

export interface StaffMemberListItemDto {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;

  profile?: {
    age?: number | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
    profileImageUrl?: string | null;
  } | null;
}

export interface GetStaffMembersResponseDto {
  members: StaffMemberListItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
