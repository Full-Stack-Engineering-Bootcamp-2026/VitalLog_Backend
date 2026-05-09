import Joi from "joi";

export const createFitnessLogSchema = Joi.object({
  activityType: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Activity type is required.",
    "string.min": "Activity type must be at least 2 characters.",
    "string.max": "Activity type cannot exceed 100 characters.",
  }),
  duration: Joi.number().integer().min(1).required().messages({
    "number.base": "Duration must be a number.",
    "number.min": "Duration must be at least 1 minute.",
    "any.required": "Duration is required.",
  }),
  caloriesBurned: Joi.number().integer().min(0).required().messages({
    "number.base": "Calories burned must be a number.",
    "number.min": "Calories burned cannot be negative.",
    "any.required": "Calories burned is required.",
  }),
  date: Joi.string().isoDate().required().messages({
    "string.isoDate": "Date must be a valid ISO date (YYYY-MM-DD).",
    "any.required": "Date is required.",
  }),
  distance: Joi.string().trim().max(50).optional(),
  notes: Joi.string().trim().max(500).optional(),
});

export const updateFitnessLogSchema = Joi.object({
  activityType: Joi.string().trim().min(2).max(100).optional(),
  duration: Joi.number().integer().min(1).optional().messages({
    "number.base": "Duration must be a number.",
    "number.min": "Duration must be at least 1 minute.",
  }),
  caloriesBurned: Joi.number().integer().min(0).optional().messages({
    "number.base": "Calories burned must be a number.",
    "number.min": "Calories burned cannot be negative.",
  }),
  date: Joi.string().isoDate().optional().messages({
    "string.isoDate": "Date must be a valid ISO date (YYYY-MM-DD).",
  }),
  distance: Joi.string().trim().max(50).optional(),
  notes: Joi.string().trim().max(500).optional(),
}).custom((val, helpers) => {
  if (Object.keys(val).length === 0) {
    return helpers.error("any.invalid", {
      message: "Provide at least one field to update.",
    });
  }
  return val;
});

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
});
