import Joi from "joi";
import { VITAL_TYPE } from "../../../common/constants/vital.constant";

// returns today's date fresh on every call — avoids stale date if server runs for days
const getToday = () => new Date().toISOString().split("T")[0];

// absolute physiological limits — not clinical ranges
// clinical ranges live in vital.constants.ts and are used by vital.service.ts
// these limits only block humanly impossible values
const ABSOLUTE_LIMITS = {
  value: { min: 0, max: 600 },
  systolic: { min: 50, max: 300 },
  diastolic: { min: 20, max: 200 },
};

//now this will create an object validation schema , how our reuest body must look like
export const createVitalSchema = Joi.object({
  vitalType: Joi.string()
    .valid(...Object.values(VITAL_TYPE))
    .required()
    .messages({
      //only vital type are valid those are defined in enum
      "any.only": `vitalType must be one of: ${Object.values(VITAL_TYPE).join(", ")}`,
      "any.required": "vitalType is required.",
    }), // single max covers all vital types (glucose max ~600)
  // service handles NORMAL/WARNING/CRITICAL classification

  value: Joi.number()
    .min(ABSOLUTE_LIMITS.value.min)
    .max(ABSOLUTE_LIMITS.value.max)
    .optional()
    .messages({
      "number.min": "Value cannot be negative.",
      "number.max": "Value exceeds the maximum allowed limit.",
    }), // blood pressure systolic — absolute physiological limit

  systolicValue: Joi.number()
    .min(ABSOLUTE_LIMITS.systolic.min)
    .max(ABSOLUTE_LIMITS.systolic.max)
    .optional()
    .messages({
      "number.min": `Systolic must be at least ${ABSOLUTE_LIMITS.systolic.min} mmHg.`,
      "number.max": `Systolic cannot exceed ${ABSOLUTE_LIMITS.systolic.max} mmHg.`,
    }), // blood pressure diastolic — absolute physiological limit

  diastolicValue: Joi.number()
    .min(ABSOLUTE_LIMITS.diastolic.min)
    .max(ABSOLUTE_LIMITS.diastolic.max)
    .optional()
    .messages({
      "number.min": `Diastolic must be at least ${ABSOLUTE_LIMITS.diastolic.min} mmHg.`,
      "number.max": `Diastolic cannot exceed ${ABSOLUTE_LIMITS.diastolic.max} mmHg.`,
    }), // cannot be a future date

  loggedDate: Joi.string()
    .isoDate()
    .custom((value, helpers) => {
      if (value > getToday()) {
        return helpers.error("date.future");
      }
      return value;
    })
    .required()
    .messages({
      "string.pattern.base": "loggedDate must be in YYYY-MM-DD format.",
      "date.future": "loggedDate cannot be in the future.",
      "any.required": "loggedDate is required.",
    }),
}) // cross-field validation — enforce correct fields per vitalType
  .custom((val, helpers) => {
    if (
      (val.vitalType === VITAL_TYPE.HEART_RATE ||
        val.vitalType === VITAL_TYPE.WEIGHT ||
        val.vitalType === VITAL_TYPE.BLOOD_GLUCOSE ||
        val.vitalType === VITAL_TYPE.SLEEP) &&
      val.value === undefined
    ) {
      return helpers.error("any.invalid", {
        message: `value is required for ${val.vitalType}.`,
      });
    }

    if (
      val.vitalType === VITAL_TYPE.BLOOD_PRESSURE &&
      (val.systolicValue === undefined || val.diastolicValue === undefined)
    ) {
      return helpers.error("any.invalid", {
        message:
          "systolicValue and diastolicValue are required for blood_pressure.",
      });
    }
    return val;
  });

export const updateVitalSchema = Joi.object({
  // same absolute limits as create
  value: Joi.number()
    .min(ABSOLUTE_LIMITS.value.min)
    .max(ABSOLUTE_LIMITS.value.max)
    .optional(),

  systolicValue: Joi.number()
    .min(ABSOLUTE_LIMITS.systolic.min)
    .max(ABSOLUTE_LIMITS.systolic.max)
    .optional(),

  diastolicValue: Joi.number()
    .min(ABSOLUTE_LIMITS.diastolic.min)
    .max(ABSOLUTE_LIMITS.diastolic.max)
    .optional(),
}).custom((val, helpers) => {
  const hasValue = val.value !== undefined;
  const hasBP =
    val.systolicValue !== undefined || val.diastolicValue !== undefined; // must provide at least one field

  if (!hasValue && !hasBP) {
    return helpers.error("any.invalid", {
      message: "Provide at least one field to update.",
    });
  } // if providing BP fields, both must be present

  if (
    (val.systolicValue !== undefined && val.diastolicValue === undefined) ||
    (val.diastolicValue !== undefined && val.systolicValue === undefined)
  ) {
    return helpers.error("any.invalid", {
      message: "Both systolicValue and diastolicValue are required together.",
    });
  }

  return val;
});

//validates query params,mhanje asa:->  /vitals?from=2026-01-01&to=2026-01-31&page=1
export const queryVitalSchema = Joi.object({
  vitalType: Joi.string()
    .valid(...Object.values(VITAL_TYPE))
    .optional()
    .messages({
      "any.only": `vitalType must be one of: ${Object.values(VITAL_TYPE).join(", ")}`,
    }),

  from: Joi.string().isoDate().optional().messages({
    "string.pattern.base": "from must be in YYYY-MM-DD format.",
  }),

  to: Joi.string().isoDate().optional().messages({
    "string.pattern.base": "to must be in YYYY-MM-DD format.",
  }), // query params arrives as stirng -> ?page=1, becomes page:"1"
  // ^\d+$ means allow only digits

  page: Joi.string().pattern(/^\d+$/).optional(),

  limit: Joi.string().pattern(/^\d+$/).optional(),
});
