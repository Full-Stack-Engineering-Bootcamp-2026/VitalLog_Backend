//const used as enum in entity
export const VITAL_TYPE = {
  HEART_RATE: "heart_rate",
  BLOOD_PRESSURE: "blood_presure",
  WEIGHT: "weight",
} as const;

export type VitalTypeValue = (typeof VITAL_TYPE)[keyof typeof VITAL_TYPE];

export const RANGE_STATUS = {
  NORMAL: "normal",
  WARNING: "borderline",
  CRITICAL: "out_of_range",
} as const;

export type RangeStatusType = (typeof RANGE_STATUS)[keyof typeof RANGE_STATUS];

export const VITAL_RANGES = {
  //outside borderline=out of range
  [VITAL_TYPE.HEART_RATE]: {
    normal: { min: 60, max: 100 },
    borderline: { min: 50, max: 110 },
  },
  [VITAL_TYPE.BLOOD_PRESSURE]: {
    //systolic ranges
    systolic: {
      normal: { min: 90, max: 120 },
      borderline: { min: 80, max: 139 },
    },
    diastolic: {
      normal: { min: 60, max: 80 },
      borderline: { min: 50, max: 89 },
    },
  },
  [VITAL_TYPE.WEIGHT]: {
    normal: { min: 40, max: 100 },
    borderline: { min: 30, max: 120 },
  },
} as const;
