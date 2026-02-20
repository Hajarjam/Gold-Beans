const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("client", "admin").required(),
  isActive: Joi.boolean().optional(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("client", "admin").optional(),
  isActive: Joi.boolean().optional(),
  password: Joi.string().min(6).optional(),
}).min(1);

const updateMeSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  // Role escalation blocked on self-update
  role: Joi.forbidden(),
  isActive: Joi.forbidden(),
}).min(1);

module.exports = { createUserSchema, updateUserSchema, updateMeSchema };
