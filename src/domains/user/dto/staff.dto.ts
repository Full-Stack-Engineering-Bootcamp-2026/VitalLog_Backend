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
