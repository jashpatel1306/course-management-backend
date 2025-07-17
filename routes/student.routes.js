const express = require("express");
const router = express.Router();

const {
  Validate,
  ValidateQueryParams
} = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isStudentAuthenticate } = require("../helpers/auth.helper");

//----------------------------- college --------------------------------//
const collegeController = require("../controllers/college.controller");
const assessmentController = require("../controllers/assessment.controller");
const batchesController = require("../controllers/batches.controller");
const courseController = require("../controllers/course.controller");
const trackingCourseController = require("../controllers/trackingCourse.controller");
const quizController = require("../controllers/quiz.controller");
const trackingQuizController = require("../controllers/trackingQuiz.controller");
const exerciseController = require("../controllers/exercise.controller");
const trackingExerciseController = require("../controllers/trackingExercise.controller");

router.post(
  "/get-all-assign-assessments",
  Validate(schemas.paginationAndFilterSchema),
  isStudentAuthenticate,
  assessmentController.getAssessmentsByStudentId
);

router.get(
  "/student-wise-courses",
  isStudentAuthenticate,
  batchesController.getCoursesByBatchId
);
router.get(
  "/student-wise-courses/dashboard",
  isStudentAuthenticate,
  batchesController.getDashboardCourses
);
router.get(
  "/course-view-data/:courseId",
  isStudentAuthenticate,
  courseController.getCourseSidebarDataById
);
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
router.post(
  "/colleges/all/:status",
  Validate(schemas.searchPaginationScema),
  isStudentAuthenticate,
  collegeController.getAllColleges
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

router.get(
  "/assessment/:id",
  isStudentAuthenticate,
  assessmentController.getAssessmentById
);

router.get(
  "/quiz/:id",
  isStudentAuthenticate,
  quizController.getStudentQuizById
);
router.get("/public-quiz/:id", quizController.getPublicQuizById);
router.post(
  "/public-quiz/:id",
  Validate(schemas.quizLoginSchema),
  quizController.getPublicQuizLogin
);

// Create and enroll in a course

router.post(
  "/quiz/enroll/:assessmentId/:quizId",
  isStudentAuthenticate,
  trackingQuizController.createEnrollQuiz
);
router.post(
  "/quiz/public-enroll/:quizId",
  Validate(schemas.publicErollSchema),
  trackingQuizController.createPublicEnrollQuiz
);

router.put(
  "/quiz/update/:quizId",
  Validate(schemas.updateQuizTrackingSchema),
  trackingQuizController.updateQuizTracking
);

router.get(
  "/exercise/:id",
  isStudentAuthenticate,
  exerciseController.getStudentExerciseById
);


// Create and enroll in a course

router.post(
  "/exercise/enroll/:assessmentId/:exerciseId",
  isStudentAuthenticate,
  trackingExerciseController.createEnrollExercise
);

router.get("/exercise-question/:id", exerciseController.getExerciseQuestionById);

// router.post(
//   "/quiz/public-enroll/:quizId",
//   Validate(schemas.publicErollSchema),
//   trackingQuizController.createPublicEnrollQuiz
// );

router.put(
  "/exercise/update/:exerciseId",
  Validate(schemas.updateExerciseTrackingSchema),
  trackingExerciseController.updateExerciseTracking
);


module.exports = router;
