import Joi from "joi";
import { VITAL_TYPE } from "../../../common/constants/vital.constant";

//now this will create an object validation schema , how our reuest body must look like
export const createVitalSchema = Joi.object({
  vitalType: Joi.string()
    .valid(...Object.values(VITAL_TYPE))
    .required()
    .messages({
      //only vital type are valid those are defined in enum
      "any.only": `vitalType must be one of: ${Object.values(VITAL_TYPE).join(", ")}`,
      "any.required": "vitalType is required.",
    }),

  //must be number ,minimun
  value: Joi.number().min(0).optional(),

  systolicValue: Joi.number().min(0).optional(),

  diastolicValue: Joi.number().min(0).optional(),

  loggedDate: Joi.string().isoDate().required().messages({
    "string.pattern.base": "loggedDate must be in YYYY-MM-DD format.",
    "any.required": "loggedDate is required.",
  }),
})
  // cross-field validation — enforce correct fields per vitalType
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
  value: Joi.number().min(0).optional(),
  systolicValue: Joi.number().min(0).optional(),
  diastolicValue: Joi.number().min(0).optional(),
}).custom((val, helpers) => {
  const hasValue = val.value !== undefined;
  const hasBP =
    val.systolicValue !== undefined || val.diastolicValue !== undefined;

  // must provide at least one field
  if (!hasValue && !hasBP) {
    return helpers.error("any.invalid", {
      message: "Provide at least one field to update.",
    });
  }

  // if providing BP fields, both must be present
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

//validates query params,mhanje asa:->  /vitals?from=2026-01-01&to=2026-01-31&page=1
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
  }),

  // query params arrives as stirng -> ?page=1, becomes page:"1"
  // ^\d+$ means allow only digits
  page: Joi.string().pattern(/^\d+$/).optional(),

  limit: Joi.string().pattern(/^\d+$/).optional(),
});
