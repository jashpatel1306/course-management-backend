const validate = require("./validation");
const Joi = require("joi");

module.exports = {
  logInSchema: Joi.object().keys({
    email: validate.reqEmail,
    password: validate.reqString,
  }),

  queryIdSchema: Joi.object().keys({
    id: validate.reqId,
  }),

  activeInactiveSchema: Joi.object().keys({
    id: validate.reqId,
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
    user_id: validate.reqString,
    password: validate.reqString,
  }),
  addCollegeSchema: Joi.object().keys({
    userId: validate.string,
    collegeName: validate.reqString,
    shortName: validate.reqString,
    collegeNo: validate.reqString,
    contactPersonName: validate.reqString,
    contactPersonNo: validate.reqString,
    email: validate.reqEmail,
    password: validate.reqString,
    active: validate.boolean,
  }),
  searchPaginationScema: Joi.object().keys({
    perPage: validate.reqNumber,
    pageNo: validate.reqNumber,
    search: validate.string,
  }),
  batchSchema: Joi.object().keys({
    batchId: validate.string,
    batchName: validate.reqString,
    batchNumber: validate.reqString,
    collegeId: validate.string,
    instructorIds: validate.array,
    courses: validate.array,
    active: validate.boolean,
  }),
  studentSchema: Joi.object().keys({
    studentId: validate.string,
    name: validate.reqString,
    email: validate.reqEmail,
    phone: validate.reqString,
    rollNo: validate.reqString,
    collegeUserId: validate.reqId,
    batchId: validate.reqId,
    department: validate.reqString,
    section: validate.reqString,
    passoutYear: validate.reqNumber,
    gender: validate.reqString,
    semester: validate.reqNumber,
    active: validate.boolean,
    colCode: validate.string,
    colName: validate.string,
  }),
  batchWiseStudentsSchema: Joi.object().keys({
    batchId: validate.string,
    collegeId: validate.string,
    search: validate.string,
    pageNo: validate.reqNumber,
    perPage: validate.reqNumber,
  }),
  collegeWiseStudentsSchema: Joi.object().keys({
    collegeId: validate.string,
    search: validate.string,
    pageNo: validate.reqNumber,
    perPage: validate.reqNumber,
  }),
  departmentSchema: Joi.object().keys({
    department: validate.reqString,
    collegeId: validate.id,
    active: validate.boolean,
  }),
  bulkStudentSchema: Joi.object().keys({
    batchId: validate.reqString,
    collegeId: validate.string,
    // excelFile: validate.object,
  }),
  questionsSchema: Joi.object().keys({
    question: validate.reqString,
    answers: validate.array.items(
      validate.object.keys({
        content: validate.reqString,
        correct: validate.boolean,
        reason: validate.string,
      })
    ),
    marks: validate.reqNumber,
    quizId: validate.reqId,
  }),

  quizSchema: Joi.object().keys({
    title: validate.reqString,
    description: validate.string,
    totalMarks: validate.reqNumber,
    questions: validate.array,
    assessmentId: validate.reqId,
  }),
  updateQuizSchema: Joi.object().keys({
    title: validate.reqString,
    description: validate.string,
    totalMarks: validate.reqNumber,
    questions: validate.array,
  }),
  createQuizSchema: Joi.object().keys({
    title: validate.reqString,
    description: validate.string,
    assessmentId: validate.reqId,
    quizId: validate.id,
  }),
  createAssessmentSchema: Joi.object().keys({
    title: validate.reqString,
    expiresAt: validate.reqDate,
  }),
  assessmentSchema: Joi.object().keys({
    assessmentId: validate.id,
    title: validate.reqString,
    description: validate.string,
    totalMarks: validate.reqNumber,
    expiresAt: validate.reqDate,
    batches: validate.array,
  }),

  paginationAndFilterSchema: Joi.object().keys({
    perPage: validate.reqNumber,
    pageNo: validate.reqNumber,
    status: validate.string,
    search: validate.string,
    batchId: validate.string,
  }),
};
