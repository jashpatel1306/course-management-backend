const Joi = require("joi");

module.exports = {
  string: Joi.string().min(0),
  reqString: Joi.string().required(),
  reqEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  number: Joi.number(),
  reqNumber: Joi.number().required(),
  array: Joi.array(),
  reqArray: Joi.array().required(),
  boolean: Joi.boolean(),
  reqBoolean: Joi.boolean().required(),
  date: Joi.date(),
  reqDate: Joi.date().required(),
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  uuid: Joi.string().uuid({ version: "uuidv4" }),
  positiveIntNumber: Joi.number().integer().positive(),
  positiveNumber: Joi.number().positive(),
  reqPositiveNumber: Joi.number().integer().positive().required(),
  positiveDecimal: Joi.number().precision(4).positive(),
  reqPositiveDecimal: Joi.number().precision(4).positive().required(),
  object: Joi.object(),
};
