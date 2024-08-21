const validate = require("./validation");
const Joi = require("joi");

module.exports = {
  userSchema: Joi.object().keys({
    email: validate.reqEmail,
    password: validate.string,
    name: validate.reqString,
    role: validate.reqString,
    mobileNo: validate.reqString,
    address: {
      addressLine1: validate.string,
      addressLine2: validate.string,
      landmark: validate.string,
      city: validate.string,
      state: validate.string,
      country: validate.string,
      pincode: validate.string,
    },
  }),

  userProfileSchema: Joi.object().keys({
    email: validate.email,
    name: validate.string,
    mobileNo: validate.string,
    address: {
      addressLine1: validate.string,
      addressLine2: validate.string,
      landmark: validate.string,
      city: validate.string,
      state: validate.string,
      country: validate.string,
      pincode: validate.string,
    },
  }),

  adminSchema: Joi.object().keys({
    email: validate.reqEmail,
    password: validate.string,
  }),

  roleSchema: Joi.object().keys({
    role: validate.reqString,
    // level: validate.reqString,
    superiorRole: validate.number,
    shortForm: validate.reqString,
    permissions: validate.reqArray,
  }),

  logInSchema: Joi.object()
    .keys({
      email: validate.string,
      password: validate.reqString,
    })
    .or("email", "id"),

  userLogInSchema: Joi.object()
    .keys({
      email: validate.string,
      mobile: validate.string,
      password: validate.reqString,
    })
    .or("email", "id"),

  queryIdSchema: Joi.object().keys({
    id: validate.id,
  }),

  activeInactiveSchema: Joi.object().keys({
    id: validate.id,
    status: validate.reqBoolean,
  }),

  forgotPasswordSchema: Joi.object().keys({
    email: validate.email,
  }),

  resetForgotPasswordSchema: Joi.object().keys({
    password: validate.reqString,
    // email: validate.email,
  }),

  
};
