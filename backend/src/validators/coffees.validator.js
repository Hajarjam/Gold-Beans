const Joi = require("joi");

const coffeeSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.base": "Le nom doit être une chaîne de caractères",
      "string.empty": "Le nom est requis",
      "string.min": "Le nom doit contenir au moins {#limit} caractères",
      "string.max": "Le nom doit contenir au maximum {#limit} caractères",
      "any.required": "Le nom est obligatoire",
    }),
  description: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.base": "La description doit être une chaîne de caractères",
      "string.empty": "La description est requise",
      "string.min": "La description doit contenir au moins {#limit} caractères",
      "string.max": "La description doit contenir au maximum {#limit} caractères",
      "any.required": "La description est obligatoire",
    }),
  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Le prix doit être un nombre",
      "number.positive": "Le prix doit être positif",
      "any.required": "Le prix est obligatoire",
    }),
  category: Joi.string()
    .required()
    .messages({
      "string.base": "La catégorie doit être une chaîne de caractères",
      "string.empty": "La catégorie est requise",
      "any.required": "La catégorie est obligatoire",
    }),
  image: Joi.string().optional(), // le middleware multer gère l'upload
});

module.exports = { coffeeSchema };
