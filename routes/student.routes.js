const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isStudentAuthenticate } = require("../helpers/auth.helper");

//----------------------------- college --------------------------------//
const collegeController = require("../controllers/college.controller");
const assessmentController = require("../controllers/assessment.controller");
router.post(
  "/get-all-assign-assessments",
  Validate(schemas.paginationAndFilterSchema),
  isStudentAuthenticate,
  assessmentController.getAssessmentsByStudentId
);

  router.post(
    "/colleges/all/:status",
    Validate(schemas.searchPaginationScema),
    isStudentAuthenticate,
    collegeController.getAllColleges
  );

// router.get(
//   "/college/:id",
//   isStudentAuthenticate,
//   collegeController.getCollegeById
// );

// router.patch(
//   "/college-status/:id",
//   isStudentAuthenticate,
//   collegeController.changeActiveStatus
// );

module.exports = router;
