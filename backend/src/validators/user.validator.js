const Joi = require("joi");

// ==============================
// CREATE USER (Register / Admin)
// ==============================
const userSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "First name must be a string",
      "string.empty": "First name is required",
      "string.min": "First name must contain at least {#limit} characters",
      "string.max": "First name must contain at most {#limit} characters",
      "any.required": "First name is required",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Last name is required",
      "any.required": "Last name is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least {#limit} characters",
      "any.required": "Password is required",
    }),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s]*$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid phone number format",
    }),

  role: Joi.string()
    .valid("client", "admin", "livreur")
    .default("client")
    .messages({
      "any.only": "Invalid role",
    }),

  accountStatus: Joi.string()
    .valid("active", "suspended")
    .default("active"),

  defaultAddressId: Joi.string().optional(),
});
