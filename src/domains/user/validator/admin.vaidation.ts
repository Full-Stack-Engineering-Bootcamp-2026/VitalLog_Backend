import Joi from "joi";

export const createStaffSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  email: Joi.string().email().required(),
});
