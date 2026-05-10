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

export interface StaffMemberDashboardResponseDto {
  member: {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  };

  profile: {
    age?: number | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
    medicalConditions?: string | null;
    fitnessGoal?: string | null;
    profileImageUrl?: string | null;
  } | null;

  vitals: {
    data: {
      id: number;
      vitalType: string;
      value?: number | null;
      systolicValue?: number | null;
      diastolicValue?: number | null;
      unit?: string | null;
      status: string;
      loggedDate: string;
      createdAt: Date;
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  streak: {
    currentStreak: number;
    longestStreak: number;
    lastLoggedDate: string | null;
  };

  activeFlags: {
    id: number;
    reason: string;
    category?: string | null;
    severity: string;
    source: string;
    createdAt: Date;
  }[];
}
