import Joi from "joi";

export const getStaffMembersSchema = Joi.object({
  page: Joi.number().integer().positive().optional().messages({}),

  limit: Joi.number().integer().positive().max(100).optional().messages({}),

  search: Joi.string().trim().allow("").optional().messages({
    "string.base": "Search must be a string",
  }),
});
