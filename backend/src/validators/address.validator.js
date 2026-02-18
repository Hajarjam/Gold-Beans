const Joi = require("joi");

const addressSchema = Joi.object({
  street: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "La rue doit être une chaîne de caractères",
      "string.empty": "La rue est requise",
      "string.min": "La rue doit contenir au moins {#limit} caractères",
      "string.max": "La rue doit contenir au maximum {#limit} caractères",
      "any.required": "La rue est obligatoire",
    }),
  city: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "La ville doit être une chaîne de caractères",
      "string.empty": "La ville est requise",
      "string.min": "La ville doit contenir au moins {#limit} caractères",
      "string.max": "La ville doit contenir au maximum {#limit} caractères",
      "any.required": "La ville est obligatoire",
    }),
  zip: Joi.string()
    .pattern(/^[0-9]{4,10}$/)
    .required()
    .messages({
      "string.pattern.base": "Le code postal doit contenir uniquement des chiffres (4 à 10 caractères)",
      "any.required": "Le code postal est obligatoire",
    }),
  country: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "Le pays doit être une chaîne de caractères",
      "string.empty": "Le pays est requis",
      "string.min": "Le pays doit contenir au moins {#limit} caractères",
      "string.max": "Le pays doit contenir au maximum {#limit} caractères",
      "any.required": "Le pays est obligatoire",
    }),
});

module.exports = { addressSchema };
