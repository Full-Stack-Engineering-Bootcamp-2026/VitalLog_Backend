export const FLAG_SOURCE = {
  SYSTEM: "SYSTEM",
  MANUAL: "MANUAL",
} as const;

export type FlagSourceType = (typeof FLAG_SOURCE)[keyof typeof FLAG_SOURCE];

export const FLAG_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type FlagSeverityType =
  (typeof FLAG_SEVERITY)[keyof typeof FLAG_SEVERITY];

export const FLAG_STATUS = {
  OPEN: "OPEN",
  RESOLVED: "RESOLVED",
} as const;

export type FlagStatusType = (typeof FLAG_STATUS)[keyof typeof FLAG_STATUS];
