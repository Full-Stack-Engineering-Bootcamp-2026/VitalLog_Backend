import Joi from "joi"

const ACTIVITY_TYPES = [
  "Running",
  "Cycling",
  "Strength",
  "Yoga",
  "Swim",
  "Walking",
  "Other",
]

const getToday = () => new Date().toISOString().split("T")[0]

export const createFitnessLogSchema = Joi.object({
  activityType: Joi.string()
    .trim()
    .valid(...ACTIVITY_TYPES)
    .required()
    .messages({
      "string.empty": "Activity type is required.",
      "any.only": "Invalid activity type.",
      "any.required": "Activity type is required.",
    }),

  duration: Joi.number()
    .integer()
    .min(1)
    .max(240)
    .required()
    .messages({
      "number.base": "Duration must be a number.",
      "number.min": "Duration must be at least 1 minute.",
      "number.max": "Duration cannot exceed 240 minutes.",
      "any.required": "Duration is required.",
    }),

  caloriesBurned: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .required()
    .messages({
      "number.base": "Calories burned must be a number.",
      "number.min": "Calories burned must be at least 1.",
      "number.max": "Calories burned cannot exceed 10,000.",
      "any.required": "Calories burned is required.",
    }),

  date: Joi.string()
    .isoDate()
    .custom((value, helpers) => {
      if (value > getToday()) {
        return helpers.error("date.future")
      }
      return value
    })
    .required()
    .messages({
      "string.isoDate": "Date must be a valid ISO date (YYYY-MM-DD).",
      "date.future": "Date cannot be in the future.",
      "any.required": "Date is required.",
    }),

  distance: Joi.string().trim().max(50).optional(),

  notes: Joi.string()
    .trim()
    .min(3)
    .max(500)
    .optional()
    .allow("")
    .messages({
      "string.min": "Notes must be at least 3 characters.",
      "string.max": "Notes cannot exceed 500 characters.",
    }),
})

export const updateFitnessLogSchema = Joi.object({
  activityType: Joi.string()
    .trim()
    .valid(...ACTIVITY_TYPES)
    .optional()
    .messages({
      "any.only": "Invalid activity type.",
    }),

  duration: Joi.number()
    .integer()
    .min(1)
    .max(240)
    .optional()
    .messages({
      "number.base": "Duration must be a number.",
      "number.min": "Duration must be at least 1 minute.",
      "number.max": "Duration cannot exceed 240 minutes.",
    }),

  caloriesBurned: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .optional()
    .messages({
      "number.base": "Calories burned must be a number.",
      "number.min": "Calories burned must be at least 1.",
      "number.max": "Calories burned cannot exceed 10,000.",
    }),

  date: Joi.string()
    .isoDate()
    .custom((value, helpers) => {
      if (value > getToday()) {
        return helpers.error("date.future")
      }
      return value
    })
    .optional()
    .messages({
      "string.isoDate": "Date must be a valid ISO date (YYYY-MM-DD).",
      "date.future": "Date cannot be in the future.",
    }),

  distance: Joi.string().trim().max(50).optional(),

  notes: Joi.string()
    .trim()
    .min(3)
    .max(500)
    .optional()
    .allow("")
    .messages({
      "string.min": "Notes must be at least 3 characters.",
      "string.max": "Notes cannot exceed 500 characters.",
    }),
}).custom((val, helpers) => {
  if (Object.keys(val).length === 0) {
    return helpers.error("any.invalid", {
      message: "Provide at least one field to update.",
    })
  }
  return val
})

export const fitnessQuerySchema = Joi.object({
  activityType: Joi.string().trim().optional(),
  from: Joi.string().isoDate().optional().messages({
    "string.isoDate": "from must be a valid ISO date (YYYY-MM-DD).",
  }),
  to: Joi.string().isoDate().optional().messages({
    "string.isoDate": "to must be a valid ISO date (YYYY-MM-DD).",
  }),
  page: Joi.string().pattern(/^\d+$/).optional(),
  limit: Joi.string().pattern(/^\d+$/).optional(),
})