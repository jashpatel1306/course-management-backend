const express = require("express");
const router = express.Router();
const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const {
  isAdminCommonAuthenticate,
  isAuthenticate,
  isSuperAdminAuthenticate,
} = require("../helpers/auth.helper");

const userController = require("../controllers/users.controller");
const batchesController = require("../controllers/batches.controller");
const studentController = require("../controllers/student.controller");
const departmentController = require("../controllers/department.controller");
const { handleExcelData } = require("../helpers/excel.helper");
const questionController = require("../controllers/question.controller");
const quizController = require("../controllers/quiz.controller");
const assessmentController = require("../controllers/assessment.controller");
router.post(
  "/sign-in",
  Validate(schemas.logInSchema),
  userController.userSignIn
);
router.get("/profile", isAuthenticate, userController.getUserProfileData);
router.post(
  "/reset-password",
  Validate(schemas.resetForgotPasswordSchema),
  isAuthenticate,
  userController.resetForgotPassword
);
router.put(
  `/update-user-profile`,
  Validate(schemas.editUserSchemas),
  isAuthenticate,
  userController.updateUserProfile
);

router.post(
  "/forgot-password",
  Validate(schemas.forgotPasswordSchema),
  userController.forgotPassword
);

router.post(
  "/verify-otp",
  Validate(schemas.otpSchema),
  userController.verifyOtp
);
router.put(
  "/password-change",
  Validate(schemas.changePasswordSchema),
  userController.changePassword
);
module.exports = router;

//------------------------------- batches ---------------------------------//

router.post(
  "/batch",
  Validate(schemas.batchSchema),
  // isAdminCommonAuthenticate,
  batchesController.createBatch
);

router.put(
  "/batch/:id",
  Validate(schemas.batchSchema),
  // isAdminCommonAuthenticate,
  batchesController.updateBatch
);

router.get(
  "/batches/all",
  isAdminCommonAuthenticate,
  batchesController.getAllBatches
);
router.get(
  "/batches-option",
  isAdminCommonAuthenticate,
  batchesController.getBatchesOption
);

router.get(
  "/batch/:id",
  // isAdminCommonAuthenticate,
  batchesController.getBatchById
);

router.put(
  "/batch/active/:id",
  // isAdminCommonAuthenticate,
  batchesController.activeStatusChange
);

//------------------------------- students ---------------------------------//

router.post(
  "/student",
  Validate(schemas.studentSchema),
  // isAdminCommonAuthenticate,
  studentController.createStudent
);

router.post(
  "/students-bulk",
  Validate(schemas.bulkStudentSchema),
  isAdminCommonAuthenticate,
  handleExcelData,
  studentController.createBulkStudents
);
router.get(
  "/students/all",
  // isAdminCommonAuthenticate,
  studentController.getAllStudents
);

router.get(
  "/student/:id",
  // isAdminCommonAuthenticate,
  studentController.getStudentById
);

router.put(
  "/student/:id",
  Validate(schemas.studentSchema),
  // isAdminCommonAuthenticate,
  studentController.updateStudent
);

router.put(
  "/student/status/:id",
  // isAdminCommonAuthenticate,
  studentController.activeStatusChange
);

router.post(
  "/batch-wise-students",
  Validate(schemas.batchWiseStudentsSchema),
  studentController.getAllStudentsBatchWise
);

router.post(
  "/college-wise-students",
  Validate(schemas.batchWiseStudentsSchema),
  studentController.getCollegeWiseStudents
);

//------------------------ department----------------------------------//

router.post(
  "/department",
  Validate(schemas.departmentSchema),
  departmentController.createDepartment
);

router.get("/departments/:userId", departmentController.getDepartments);

router.put(
  "/department/:id",
  Validate(schemas.departmentSchema),
  departmentController.updateDepartment
);

//------------------------------- questions ---------------------------------//
router.post(
  "/question",
  Validate(schemas.questionsSchema),
  isAdminCommonAuthenticate,
  questionController.createQuestion
);

router.put(
  "/question/:id",
  Validate(schemas.questionsSchema),
  isAdminCommonAuthenticate,
  questionController.updateQuestion
);

router.get(
  "/question/:id",
  isAdminCommonAuthenticate,
  questionController.getQuestionById
);

router.post(
  "/get-questions/:quizId",
  Validate(schemas.paginationAndFilterSchema),
  isAdminCommonAuthenticate,
  questionController.getQuestionsByQuiz
);

router.put(
  "/question-status/:id",
  isAdminCommonAuthenticate,
  questionController.changeActiveStatus
);

router.delete(
  "/question/:id",
  isAdminCommonAuthenticate,
  questionController.deleteQuestion
);

//------------------------------ quiz ---------------------------------//

router.post(
  "/quiz",
  Validate(schemas.quizSchema),
  isAdminCommonAuthenticate,
  quizController.createQuiz
);

router.put(
  "/quiz/:id",
  Validate(schemas.quizSchema),
  isAdminCommonAuthenticate,
  quizController.updateQuiz
);

router.get("/quiz/:id", isAdminCommonAuthenticate, quizController.getQuizById);

router.get(
  "/quizzes/:assessmentId",
  isAdminCommonAuthenticate,
  quizController.getQuizzesByAssessment
);

router.put(
  "/quiz/:status",
  isAdminCommonAuthenticate,
  quizController.changeActiveStatusQuiz
);

router.delete(
  "/quiz/:id",
  isAdminCommonAuthenticate,
  quizController.deleteQuiz
);

//------------------------------- assessments ---------------------------------//

router.post(
  "/assessment",
  Validate(schemas.assessmentSchema),
  isAdminCommonAuthenticate,
  assessmentController.createAssessment
);

router.put(
  "/assessment/:id",
  Validate(schemas.assessmentSchema),
  isAdminCommonAuthenticate,
  assessmentController.updateAssessment
);

router.get(
  "/assessment/:id",
  isAdminCommonAuthenticate,
  assessmentController.getAssessmentById
);

router.get(
  "/assessments/:batchId",
  isAdminCommonAuthenticate,
  assessmentController.getAssessmentsByBatch
);

router.put(
  "/assessment/:status",
  isAdminCommonAuthenticate,
  assessmentController.changeActiveStatus
);

router.delete(
  "/assessment/:id",
  isAdminCommonAuthenticate,
  assessmentController.deleteAssessment
);

module.exports = router;
