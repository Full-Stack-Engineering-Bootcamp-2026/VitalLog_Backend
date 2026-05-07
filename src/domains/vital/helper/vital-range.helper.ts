import {
  VITAL_TYPE,
  VITAL_RANGES,
  RANGE_STATUS,
  RangeStatusType,
  VitalTypeValue,
} from "../../../common/constants/vital.constant";
import {
  FLAG_SEVERITY,
  FlagSeverityType,
} from "../../../common/constants/flag.constant";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isWithinBand(
  value: number,
  band: { min: number; max: number },
): boolean {
  return value >= band.min && value <= band.max;
}

// ─── Single-value vitals (heart_rate, blood_glucose, weight, sleep) ──────────

function assessSingleValue(
  value: number,
  ranges: {
    normal: { min: number; max: number };
    borderline: { min: number; max: number };
    critical: { min: number; max: number };
  },
): { status: RangeStatusType; severity: FlagSeverityType | null } {
  if (isWithinBand(value, ranges.normal)) {
    return { status: RANGE_STATUS.NORMAL, severity: null };
  }

  if (isWithinBand(value, ranges.borderline)) {
    return { status: RANGE_STATUS.WARNING, severity: FLAG_SEVERITY.LOW };
  }

  if (isWithinBand(value, ranges.critical)) {
    return { status: RANGE_STATUS.CRITICAL, severity: FLAG_SEVERITY.MEDIUM };
  }

  // beyond critical band
  return { status: RANGE_STATUS.CRITICAL, severity: FLAG_SEVERITY.HIGH };
}

// Blood Pressure
function assessBloodPressure(
  systolic: number,
  diastolic: number,
): { status: RangeStatusType; severity: FlagSeverityType | null } {
  const bpRanges = VITAL_RANGES[VITAL_TYPE.BLOOD_PRESSURE];

  const systolicResult = assessSingleValue(systolic, bpRanges.systolic);
  const diastolicResult = assessSingleValue(diastolic, bpRanges.diastolic);

  // Take the worse of the two readings
  const severityRank: Record<string, number> = {
    [RANGE_STATUS.NORMAL]: 0,
    [RANGE_STATUS.WARNING]: 1,
    [RANGE_STATUS.CRITICAL]: 2,
  };

  if (
    severityRank[systolicResult.status] >= severityRank[diastolicResult.status]
  ) {
    return systolicResult;
  }

  return diastolicResult;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function assessVital(
  vitalType: VitalTypeValue,
  value?: number,
  systolicValue?: number,
  diastolicValue?: number,
): { status: RangeStatusType; severity: FlagSeverityType | null } {
  switch (vitalType) {
    case VITAL_TYPE.BLOOD_PRESSURE:
      return assessBloodPressure(systolicValue!, diastolicValue!);

    case VITAL_TYPE.HEART_RATE:
      return assessSingleValue(value!, VITAL_RANGES[VITAL_TYPE.HEART_RATE]);

    case VITAL_TYPE.BLOOD_GLUCOSE:
      return assessSingleValue(value!, VITAL_RANGES[VITAL_TYPE.BLOOD_GLUCOSE]);

    case VITAL_TYPE.WEIGHT:
      return assessSingleValue(value!, VITAL_RANGES[VITAL_TYPE.WEIGHT]);

    case VITAL_TYPE.SLEEP:
      return assessSingleValue(value!, VITAL_RANGES[VITAL_TYPE.SLEEP]);

    default:
      return { status: RANGE_STATUS.NORMAL, severity: null };
  }
}

// ─── Unit resolver ───────────────────────────────────────────────────────────

export function resolveUnit(vitalType: VitalTypeValue): string {
  const units: Record<VitalTypeValue, string> = {
    [VITAL_TYPE.HEART_RATE]: "bpm",
    [VITAL_TYPE.BLOOD_PRESSURE]: "mmHg",
    [VITAL_TYPE.BLOOD_GLUCOSE]: "mg/dL",
    [VITAL_TYPE.WEIGHT]: "kg",
    [VITAL_TYPE.SLEEP]: "hours",
  };
  return units[vitalType];
}
