import Joi from "joi";
import {
  FLAG_SEVERITY,
  FLAG_STATUS,
  FLAG_SOURCE,
} from "../../../common/constants/flag.constant";

// manual flag creation schema
export const createManualFlagSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "userId must be a number.",
    "any.required": "userId is required.",
  }),

  reason: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Reason is required.",
    "string.min": "Reason must be at least 5 characters.",
    "string.max": "Reason cannot exceed 500 characters.",
  }),
  sourceVitalId: Joi.number().integer().positive().optional().messages({
    "number.base": "Source vital id must be a number",
    "number.integer": "Source vital id must be an integer",
    "number.positive": "Source vital id must be positive",
  }),

  severity: Joi.string()
    .valid(...Object.values(FLAG_SEVERITY))
    .required()
    .messages({
      "any.only": `severity must be LOW ,MEDIUM ,HIGH`,
      "any.required": "severity is required.",
    }),

  category: Joi.string().trim().max(100).optional(),
});

// resolve flag schema
export const resolveFlagSchema = Joi.object({
  resolutionNote: Joi.string().trim().max(500).optional(),
});

// // query params schema
// export const flagQuerySchema = Joi.object({
//   status: Joi.string()
//     .valid(...Object.values(FLAG_STATUS))
//     .optional()
//     .messages({
//       "any.only": `status must be one of: ${Object.values(FLAG_STATUS).join(", ")}`,
//     }),

//   source: Joi.string()
//     .valid(...Object.values(FLAG_SOURCE))
//     .optional()
//     .messages({
//       "any.only": `source must be one of: ${Object.values(FLAG_SOURCE).join(", ")}`,
//     }),

//   page: Joi.string().pattern(/^\d+$/).optional(),
//   limit: Joi.string().pattern(/^\d+$/).optional(),
// });
