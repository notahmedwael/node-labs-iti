import Joi from 'joi';

export const productJoiSchema = Joi.object({
  owner: Joi.string().required(),

  name: Joi.string().min(5).max(20).required(),
  quantity: Joi.number().min(0).required(),
  categories: Joi.array().items(Joi.string()).default(['General'])
});