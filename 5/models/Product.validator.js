import Joi from 'joi';

export const productJoiSchema = Joi.object({
  owner: Joi.any().strip(), // if someone sends an owner id in the request body ignore it because we are dealing with jwt tokens only

  name: Joi.string().min(5).max(20).required(),
  quantity: Joi.number().min(0).required(),
  categories: Joi.array().items(Joi.string()).default(['General'])
});