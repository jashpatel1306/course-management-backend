const express = require("express");
const router = express.Router();
const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const {
  isAdminCommonAuthenticate,
  isAuthenticate,
} = require("../helpers/auth.helper");

const userController = require("../controllers/users.controller");
const batchesController = require("../controllers/batches.controller");
const studentController = require("../controllers/student.controller");
const departmentController = require("../controllers/department.controller");
const { handleExcelData } = require("../helpers/excel.helper");
const questionController = require("../controllers/question.controller");
const quizController = require("../controllers/quiz.controller");
const assessmentController = require("../controllers/assessment.controller");
const instructorsController = require("../controllers/instructors.controller");
const multipartUploadController = require("../controllers/multipartUpload.controller");
const fileUploadController = require("../controllers/fileUpload.controller");
const courseController = require("../controllers/course.controller");
const sectionController = require("../controllers/section.controller");
const lectureController = require("../controllers/lecture.contoller");
const instructorCourseController = require("../controllers/instructorCourse.controller");
const assignAssessmentController = require("../controllers/assignAssement.controller");
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
  "/batches/:collegeId",
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

router.get(
  "/course-option-by-batch/:batchId",
  isAdminCommonAuthenticate,
  batchesController.getCourseOptionsByBatch
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
  isAdminCommonAuthenticate,
  studentController.getAllStudentsBatchWise
);

router.post(
  "/college-wise-students",
  Validate(schemas.batchWiseStudentsSchema),
  isAdminCommonAuthenticate,
  studentController.getCollegeWiseStudents
);

//------------------------ department----------------------------------//

router.post(
  "/department",
  Validate(schemas.departmentSchema),
  isAdminCommonAuthenticate,
  departmentController.createDepartment
);

router.get("/departments/:collegeId", departmentController.getDepartments);

router.put(
  "/department/:id",
  Validate(schemas.departmentSchema),
  isAdminCommonAuthenticate,
  departmentController.updateDepartment
);

router.get(
  "/department-options/:collegeId",
  isAdminCommonAuthenticate,
  departmentController.getDepartmentsOptions
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
  Validate(schemas.createQuizSchema),
  isAdminCommonAuthenticate,
  quizController.createQuiz
);

router.put(
  "/quiz/:id",
  Validate(schemas.updateQuizSchema),
  isAdminCommonAuthenticate,
  quizController.updateQuiz
);

router.get("/quiz/:id", isAdminCommonAuthenticate, quizController.getQuizById);

router.post(
  "/get-quizzes/:assessmentId",
  Validate(schemas.paginationAndFilterSchema),
  isAdminCommonAuthenticate,
  quizController.getQuizzesByAssessment
);

router.put(
  "/quiz/status/:id",
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
  Validate(schemas.createAssessmentSchema),
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

router.post(
  "/get-all-assessments",
  Validate(schemas.batchWiseStudentsSchema),
  isAdminCommonAuthenticate,
  assessmentController.getAssessmentsByBatch
);

router.put(
  "/assessment/status/:id",
  isAdminCommonAuthenticate,
  assessmentController.changeActiveStatus
);

router.delete(
  "/assessment/:id",
  isAdminCommonAuthenticate,
  assessmentController.deleteAssessment
);
router.get(
  "/assessment-option-by-college/:collegeId",
  isAdminCommonAuthenticate,
  assessmentController.getAssessmentOptionsByCollegeId
);

//---------------------------------- instructors --------------------------------//

router.post(
  "/assign-batch-assessment",
  Validate(schemas.createBatchAssignAssessmentSchema),
  isAdminCommonAuthenticate,
  assignAssessmentController.createAssignBatchwiseAssessment
);

router.post(
  "/assign-course-assessment",
  Validate(schemas.createCourseAssignAssessmentSchema),
  isAdminCommonAuthenticate,
  assignAssessmentController.createAssignCoursewiseAssessment
);

router.put(
  "/assign-assessment/:assignId",
  Validate(schemas.assignAssessmentSchema),
  isAdminCommonAuthenticate,
  assignAssessmentController.updateAssignAssessment
);

router.get(
  "/assessment-batch/:batchId",
  isAdminCommonAuthenticate,
  assignAssessmentController.getAssessmentByBatchId
);
router.get(
  "/assessment-course/:courseId",
  isAdminCommonAuthenticate,
  assignAssessmentController.getAssessmentByCourseId
);
router.post(
  "/get-all-assign-assessments",
  Validate(schemas.paginationAndFilterSchema),
  isAdminCommonAuthenticate,
  assignAssessmentController.getAllAssignAssessment
);

router.delete(
  "/assign-assessment/:assignId",
  isAdminCommonAuthenticate,
  assignAssessmentController.deleteAssignAssessment
);

//---------------------------------- instructors --------------------------------//

router.post(
  "/instructor",
  Validate(schemas.instructorSchema),
  isAdminCommonAuthenticate,
  instructorsController.createInstructor
);

router.put(
  "/instructor/:id",
  Validate(schemas.instructorSchema),
  isAdminCommonAuthenticate,
  instructorsController.updateInstructor
);

router.get(
  "/instructor/:id",
  isAdminCommonAuthenticate,
  instructorsController.getInstructorById
);

router.post(
  "/get-instructors/college",
  Validate(schemas.instructorsCollegeIdSchema),
  isAdminCommonAuthenticate,
  instructorsController.getInstructorsByCollegeId
);

router.put(
  "/instructor/status/:id",
  isAdminCommonAuthenticate,
  instructorsController.statusToggle
);

router.get(
  "/instructor/mappings/:collegeId",
  isAdminCommonAuthenticate,
  instructorsController.getInstructorsNameIdMappingByCollegeId
);

router.get(
  "/instructor-options/:collegeId",
  isAdminCommonAuthenticate,
  instructorsController.getInstructorsOptions
);

//---------------------------  file upload ------------------------//

//multipart upload
router.post(
  "/start-upload",
  isAdminCommonAuthenticate,
  Validate(schemas.startUploadSchema),
  multipartUploadController.startUpload
);

router.post(
  "/upload-part",
  Validate(schemas.uploadPartSchema),
  multipartUploadController.uploadPart
);

router.post(
  "/complete-upload",
  Validate(schemas.completeUploadSchema),
  multipartUploadController.completeUpload
);

router.post(
  "/upload-file",
  // Validate(schemas.uploadFileSchema),
  fileUploadController.uploadImage
);

//--------------------------- courses -------------------------//

router.post(
  "/course",
  Validate(schemas.courseSchema),
  isAdminCommonAuthenticate,
  courseController.createCourse
);

router.put(
  "/course/:id",
  Validate(schemas.courseSchema),
  isAdminCommonAuthenticate,
  courseController.updateCourse
);

router.get(
  "/course/:id",
  isAdminCommonAuthenticate,
  courseController.getCourseById
);

router.put(
  "/course/status/:id",
  isAdminCommonAuthenticate,
  courseController.statusToggle
);

router.put(
  "/course/published/:id",
  isAdminCommonAuthenticate,
  courseController.publishToggle
);

router.post(
  "/college-wise-courses",
  Validate(schemas.collegeWiseDataSchema),
  isAdminCommonAuthenticate,
  courseController.getCoursesByCollegeId
);
router.post(
  "/assign-course",
  Validate(schemas.assignCourseSchema),
  isAdminCommonAuthenticate,
  courseController.addAssignCourse
);
router.post(
  "/assign-course-college",
  Validate(schemas.assignCourseCollegeSchema),
  isAdminCommonAuthenticate,
  courseController.addAssignCourseCollege
);

router.get(
  "/college-wise-courses-options/:collegeId",
  isAdminCommonAuthenticate,
  courseController.getCoursesOptions
);
router.get(
  "/courses-wise-section-options/:courseId",
  isAdminCommonAuthenticate,
  courseController.getCourseSectionOptionsByCourseId
);
router.get(
  "/courses-preview/:courseId",
  isAdminCommonAuthenticate,
  courseController.getCoursepreviewById
);
//--------------------------- Sections -------------------------//

router.post(
  "/section",
  Validate(schemas.sectionSchema),
  isAdminCommonAuthenticate,
  sectionController.createSection
);

router.put(
  "/section/:id",
  Validate(schemas.sectionSchema),
  isAdminCommonAuthenticate,
  sectionController.updateSection
);

router.get(
  "/section/:id",
  isAdminCommonAuthenticate,
  sectionController.getSectionById
);

router.put(
  "/section/status/:id",
  isAdminCommonAuthenticate,
  sectionController.toggleActiveStatus
);

router.put(
  "/section/published/:id",
  isAdminCommonAuthenticate,
  sectionController.toggleSectionPublishStatus
);

router.get(
  "/course-wise-sections/:id",
  isAdminCommonAuthenticate,
  sectionController.getSectionsByCourseId
);

// router.get(
//   "/courses-wise-section-options/:courseId",
//   isAdminCommonAuthenticate,
//   courseController.getCourseSectionOptionsByCourseId
// );

//------------------------------- lectures -------------------------//

router.post(
  "/lecture",
  Validate(schemas.lectureSchema),
  isAdminCommonAuthenticate,
  lectureController.createLecture
);

router.put(
  "/lecture/:id",
  Validate(schemas.lectureSchema),
  isAdminCommonAuthenticate,
  lectureController.updateLecture
);
router.put(
  "/lecture-content/:id",
  Validate(schemas.lectureContentSchema),
  isAdminCommonAuthenticate,
  lectureController.updateLectureContent
);
router.put(
  "/lecture-content-drag-drop/:id",
  Validate(schemas.lectureContentDragDropSchema),
  isAdminCommonAuthenticate,
  lectureController.updateLectureContentDragDrop
);
router.get(
  "/lecture/:id",
  isAdminCommonAuthenticate,
  lectureController.getLectureById
);

router.delete(
  "/lecture/:id",
  isAdminCommonAuthenticate,
  lectureController.deleteLecture
);
router.delete(
  "/lecture-content/:lectureId/:contentId",
  isAdminCommonAuthenticate,
  lectureController.deleteLectureContent
);
router.put(
  "/lecture/status/:id",
  isAdminCommonAuthenticate,
  lectureController.toggleLectureStatus
);

router.put(
  "/lecture/publish/:id",
  isAdminCommonAuthenticate,
  lectureController.toggleLecturePublishStatus
);
router.get(
  "/section-wise-lecture-options/:sectionId",
  isAdminCommonAuthenticate,
  lectureController.getSectionLectureOptionsByCourseId
);

//------------------------ instructor course ------------------------//

router.post(
  "/instructor-course",
  Validate(schemas.courseSchema),
  isAdminCommonAuthenticate,
  instructorCourseController.createInstructorCourse
);
router.put(
  "/instructor-course/:id",
  Validate(schemas.courseSchema),
  isAdminCommonAuthenticate,
  instructorCourseController.updateInstructorCourse
);

router.post(
  "/college-wise-instructor-courses",
  Validate(schemas.collegeWiseDataSchema),
  isAdminCommonAuthenticate,
  instructorCourseController.getInstructorCoursesByCollegeId
);

// Get an Instructor Course by ID
router.get(
  "/instructor-course/:id",
  isAdminCommonAuthenticate,
  instructorCourseController.getInstructorCourseById
);

// // Delete an Instructor Course by ID
router.delete(
  "/instructor-course/:id",
  isAdminCommonAuthenticate,
  instructorCourseController.deleteInstructorCourse
);
router.put(
  "/instructor-content/:id",
  Validate(schemas.instructorCourseContentSchema),
  isAdminCommonAuthenticate,
  instructorCourseController.updateInstructorCourseContent
);
router.delete(
  "/instructor-content/:contentId",
  isAdminCommonAuthenticate,
  instructorCourseController.deleteInstructorCourseContent
);
router.get(
  "/college-wise-instructor-courses-options/:collegeId",
  isAdminCommonAuthenticate,
  instructorCourseController.getInstructorCoursesOptions
);

// Assign a Course to a College
router.post(
  "/assign-instructor-course-college",
  Validate(schemas.assignCourseCollegeSchema),
  isAdminCommonAuthenticate,
  instructorCourseController.addAssignCourseCollege
);
router.get(
  "/instructor-courses/:id",
  isAdminCommonAuthenticate,
  instructorCourseController.getInstructorCourseById
);
module.exports = router;
