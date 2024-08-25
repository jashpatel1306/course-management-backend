const validate = require("./validation");
const Joi = require("joi");

module.exports = {
  logInSchema: Joi.object().keys({
    email: validate.reqEmail,
    password: validate.reqString,
  }),

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
    oldPassword: validate.reqString,
    newPassword: validate.reqString,
  }),
  editUserSchemas: Joi.object().keys({
    user_id: validate.string,
    user_name: validate.reqString,
    email: validate.email,
    password: validate.string,
    active: validate.reqBoolean,
  }),
  otpSchema: Joi.object().keys({
    email: validate.email,
    otp: validate.reqString,
  }),
  changePasswordSchema: Joi.object().keys({
    email: validate.reqEmail,
    password: validate.reqString,
  }),
  addCollegeSchema: Joi.object().keys({
    collegeName: validate.reqString,
    shortName: validate.reqString,
    collegeNo: validate.reqString,
    contactPersonName: validate.reqString,
    contactPersonNo: validate.reqString,
    email: validate.reqEmail,
    password: validate.reqString,
  }),
  searchPaginationScema: Joi.object().keys({
    perPage: validate.reqNumber,
    pageNo: validate.reqNumber,
    search: validate.string,
  }),
  batchSchema: Joi.object().keys({
    batchName: validate.reqString,
    batchNumber: validate.reqNumber,
    collegeId: validate.string,
    trainerIds: validate.array,
    courses: validate.array,
  }),
  studentSchema: Joi.object().keys({
    name: validate.reqString,
    email: validate.reqEmail,
    phone: validate.reqString,
    collegeUserId: validate.id,
    batchId: validate.id,
    department: validate.reqString,
    section: validate.reqString,
    passoutYear: validate.reqNumber,
    gender: validate.reqString,
    semester: validate.reqNumber,
  }),
  batchWiseStudentsSchema: Joi.object().keys({
    batchId: validate.id,
    search: validate.string,
    pageNo: validate.reqNumber,
    perPage: validate.reqNumber,
  }),
  collegeWiseStudentsSchema: Joi.object().keys({
    collegeId: validate.id,
    search: validate.string,
    pageNo: validate.reqNumber,
    perPage: validate.reqNumber,
  }),
  departmentSchema: Joi.object().keys({
    departments: validate.array,
    userId: validate.id,
  }),
};
