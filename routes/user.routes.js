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
  isAdminCommonAuthenticate,
  batchesController.createBatch
);

router.put(
  "/batch/:id",
  Validate(schemas.batchSchema),
  isAdminCommonAuthenticate,
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
  isAdminCommonAuthenticate,
  batchesController.getBatchById
);

router.put(
  "/batch/active/:id",
  isAdminCommonAuthenticate,
  batchesController.activeStatusChange
);

//------------------------------- students ---------------------------------//

router.post(
  "/student",
  Validate(schemas.studentSchema),
  isAdminCommonAuthenticate,
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
  isAdminCommonAuthenticate,
  studentController.getAllStudents
);

router.get(
  "/student/:id",
  isAdminCommonAuthenticate,
  studentController.getStudentById
);

router.put(
  "/student/:id",
  Validate(schemas.studentSchema),
  isAdminCommonAuthenticate,
  studentController.updateStudent
);

router.put(
  "/student/status/:id",
  isAdminCommonAuthenticate,
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

module.exports = router;
