const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const {
  isSuperAdminAuthenticate,
  isAdminCommonAuthenticate,
} = require("../helpers/auth.helper");

//----------------------------- college --------------------------------//
const collegeController = require("../controllers/college.controller");
const instructorCourseController = require("../controllers/instructorCourse.controller");
const batcheController = require("../controllers/batches.controller");

router.post(
  "/college",
  Validate(schemas.addCollegeSchema),
  isSuperAdminAuthenticate,
  collegeController.createCollege
);

router.post(
  "/colleges/all/:status",
  Validate(schemas.searchPaginationSchema),
  isSuperAdminAuthenticate,
  collegeController.getAllColleges
);

router.get(
  "/college/:id",
  isSuperAdminAuthenticate,
  collegeController.getCollegeById
);

router.patch(
  "/college-status/:id",
  isSuperAdminAuthenticate,
  collegeController.changeActiveStatus
);
router.get(
  "/college-option",
  isAdminCommonAuthenticate,
  collegeController.getCollegesOption
);

router.get(
  "/batches-option/:collegeId",
  isAdminCommonAuthenticate,
  batcheController.getBatchesOption
);

//----------------------- instructor courses------------------------//

module.exports = router;
