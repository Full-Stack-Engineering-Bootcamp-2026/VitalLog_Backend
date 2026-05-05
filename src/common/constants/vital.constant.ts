export const VITAL_STATUS = {
  NORMAL: "NORMAL",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
} as const;

export type VitalStatusType = (typeof VITAL_STATUS)[keyof typeof VITAL_STATUS];
