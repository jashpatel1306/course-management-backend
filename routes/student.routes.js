const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isStudentAuthenticate } = require("../helpers/auth.helper");

//----------------------------- college --------------------------------//
const collegeController = require("../controllers/college.controller");
const assessmentController = require("../controllers/assessment.controller");
const batchesController = require("../controllers/batches.controller");
const courseController = require("../controllers/course.controller");
const trackingCourseController = require("../controllers/trackingCourse.controller");

router.post(
  "/get-all-assign-assessments",
  Validate(schemas.paginationAndFilterSchema),
  isStudentAuthenticate,
  assessmentController.getAssessmentsByStudentId
);

// router.post(
//   "/",
//   Validate(schemas.searchPaginationScema),
//   isStudentAuthenticate,
//   collegeController.getAllColleges
// );

router.get(
  "/student-wise-courses",
  isStudentAuthenticate,
  batchesController.getCoursesByBatchId
);
router.get(
  "/course-view-data/:courseId",
  isStudentAuthenticate,
  courseController.getCourseSidebarDataById
);
// router.patch(
//   "/college-status/:id",
//   isStudentAuthenticate,
//   collegeController.changeActiveStatus
// );

// Create and enroll in a course
router.post(
  "/course/enroll/:courseId",
  isStudentAuthenticate,
  trackingCourseController.createEnrollCourse
);

// Create a new tracking course
router.post(
  "/course/tracking",
  Validate(schemas.createTrackingCourseSchema),
  isStudentAuthenticate,
  trackingCourseController.createTrackingCourse
);

// Get tracking course by userId and courseId
router.get(
  "/course/tracking/:userId/:courseId",
  isStudentAuthenticate,
  trackingCourseController.getTrackingCourseById
);

// Get tracking course by userId
router.get(
  "/course/tracking",
  isStudentAuthenticate,
  trackingCourseController.getTrackingCourseByUserId
);

// Update tracking course
router.put(
  "/course/tracking/:courseId",
  Validate(schemas.updateTrackingCourseSchema),
  isStudentAuthenticate,
  trackingCourseController.updateTrackingCourse
);

// Delete a tracking course
router.delete(
  "/course/tracking/:id",
  Validate(schemas.paginationAndFilterSchema),
  isStudentAuthenticate,
  trackingCourseController.deleteTrackingCourse
);

// Add tracking content
router.post(
  "/course/tracking/:userId/:courseId/content",
  Validate(schemas.addTrackingContentSchema),
  isStudentAuthenticate,
  trackingCourseController.addTrackingContent
);

module.exports = router;
