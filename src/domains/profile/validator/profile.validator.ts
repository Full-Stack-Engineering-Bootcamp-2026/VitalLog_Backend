import Joi from "joi"
import { GENDER } from "../../../common/constants/gender.constants"

export const updateProfileSchema = Joi.object({
  age: Joi.number().integer().min(1).max(120).optional(),
  gender: Joi.string().valid(...Object.values(GENDER)).optional(),
  height: Joi.number().min(50).max(300).optional(),
  weight: Joi.number().min(10).max(500).optional(),
  medicalConditions: Joi.string().allow("").optional(),
  fitnessGoal: Joi.string().allow("").optional(),
})