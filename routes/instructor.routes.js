const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isInstructorAuthenticate } = require("../helpers/auth.helper");

const instructorsController = require("../controllers/instructors.controller");

router.get(
  "/instructor-wise-courses",
  isInstructorAuthenticate,
  instructorsController.getInstructorCourses
);


module.exports = router;
