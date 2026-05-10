
export const VITAL_TYPE = {
  HEART_RATE: "HEART_RATE",
  BLOOD_PRESSURE: "BLOOD_PRESSURE",
  BLOOD_GLUCOSE: "BLOOD_GLUCOSE",
  WEIGHT: "WEIGHT",
  SLEEP: "SLEEP",
} as const;

export type VitalTypeValue = (typeof VITAL_TYPE)[keyof typeof VITAL_TYPE];

export const RANGE_STATUS = {
  NORMAL: "NORMAL",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
} as const;

export type RangeStatusType = (typeof RANGE_STATUS)[keyof typeof RANGE_STATUS];

// Three-band thresholds:
// within normal             → NORMAL  (no flag)
// outside normal, within borderline → WARNING (LOW flag)
// outside borderline, within critical → CRITICAL (MEDIUM flag)
// outside critical          → CRITICAL (HIGH flag)
export const VITAL_RANGES = {
  [VITAL_TYPE.HEART_RATE]: {
    normal: { min: 60, max: 100 },
    borderline: { min: 50, max: 110 },
    critical: { min: 40, max: 130 },
  },
  [VITAL_TYPE.BLOOD_PRESSURE]: {
    systolic: {
      normal: { min: 90, max: 120 },
      borderline: { min: 80, max: 139 },
      critical: { min: 70, max: 160 },
    },
    diastolic: {
      normal: { min: 60, max: 80 },
      borderline: { min: 50, max: 89 },
      critical: { min: 40, max: 100 },
    },
  },
  [VITAL_TYPE.BLOOD_GLUCOSE]: {
    normal: { min: 70, max: 99 },
    borderline: { min: 60, max: 125 },
    critical: { min: 50, max: 200 },
  },
  [VITAL_TYPE.WEIGHT]: {
    normal: { min: 40, max: 100 },
    borderline: { min: 30, max: 120 },
    critical: { min: 20, max: 150 },
  },
  [VITAL_TYPE.SLEEP]: {
    normal: { min: 7, max: 9 },
    borderline: { min: 5, max: 10 },
    critical: { min: 3, max: 12 },
  },
} as const;
