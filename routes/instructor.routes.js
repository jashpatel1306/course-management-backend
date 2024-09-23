const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isInstructorAuthenticate } = require("../helpers/auth.helper");

const instructorsController = require("../controllers/instructors.controller");
const instructorCourseController = require("../controllers/instructorCourse.controller");

router.get(
  "/instructor-wise-courses",
  isInstructorAuthenticate,
  instructorsController.getInstructorCourses
);
router.get(
  "/instructor-courses/:id",
  isInstructorAuthenticate,
  instructorCourseController.getInstructorCourseById
);



module.exports = router;
