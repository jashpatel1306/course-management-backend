const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isSuperAdminAuthenticate } = require("../helpers/auth.helper");

//----------------------------- college --------------------------------//
const collegeController = require("../controllers/college.controller");
const instructorCourseController = require("../controllers/instructorCourse.controller");
router.post(
  "/college",
  Validate(schemas.addCollegeSchema),
  isSuperAdminAuthenticate,
  collegeController.createCollege
);

router.post(
  "/colleges/all/:status",
  Validate(schemas.searchPaginationScema),
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
  isSuperAdminAuthenticate,
  collegeController.getCollegesOption
);

const batcheController = require("../controllers/batches.controller");

router.get(
  "/batches-option/:collegeId",
  isSuperAdminAuthenticate,
  batcheController.getBatchesOption
);

//----------------------- instructor courses------------------------//

router.post(
  "/instructor-course",
  Validate(schemas.addInstructorCourseSchema),
  isSuperAdminAuthenticate,
  instructorCourseController.createInstructorCourse
);

// Get an Instructor Course by ID
router.get(
  "/instructor-course/:id",
  isSuperAdminAuthenticate,
  instructorCourseController.getInstructorCourseById
);

// Update an Instructor Course by ID
router.put(
  "/instructor-course/:id",
  Validate(schemas.addInstructorCourseSchema),
  isSuperAdminAuthenticate,
  instructorCourseController.updateInstructorCourse
);

// Delete an Instructor Course by ID
router.delete(
  "/instructor-course/:id",
  isSuperAdminAuthenticate,
  instructorCourseController.deleteInstructorCourse
);

// Toggle the 'active' status of an Instructor Course
router.patch(
  "/instructor-course/toggle-status/:id",
  isSuperAdminAuthenticate,
  instructorCourseController.toggleInstructorCourseStatus
);

// Toggle the 'isPublish' status of an Instructor Course
router.patch(
  "/instructor-course/toggle-publish-status/:id",
  isSuperAdminAuthenticate,
  instructorCourseController.toggleInstructorCoursePublishStatus
);

// Get all publish Instructor Courses
router.get(
  "/instructor-courses/publish",
  instructorCourseController.getPublishInstructorCourses
);

// Assign a Course to a College
router.post(
  "/instructor-course/assign/:id/:collegeId",
  isSuperAdminAuthenticate,
  instructorCourseController.assignCourseToCollege
);

module.exports = router;
