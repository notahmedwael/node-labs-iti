import Joi from 'joi';

export const userJoiSchema = Joi.object({
  username: Joi.string().min(8).required(),
  password: Joi.string().required(),
  firstName: Joi.string().min(3).max(15).required(),
  lastName: Joi.string().min(3).max(15).required(),
  dob: Joi.date().optional()
});