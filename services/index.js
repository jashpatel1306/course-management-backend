const dashboardServices = require("./dashboard.services");

module.exports = {
  userServices: require(`./users/user.service`),
  modulesServices: require(`./modules/modules.service`),
  assessmentServices: require(`./assessments/assessments.services`),
  batchServices: require(`./batches/batches.services`),
  collegeServices: require(`./colleges/colleges.service`),
  departmentService: require(`./departments/departments.services`),
  quizzesServices: require(`./quizzes/quizzes.services`),
  questionServices: require(`./questions/questions.services`),
  studentServices: require(`./students/student.services`),
  instructorServices: require(`./instructor/instructor.services`),
  courseServices: require(`./courses/courseServices`),
  sectionServices: require("./section/section.services"),
  lectureServices: require("./lectures/lectures.services"),
  instructorCourseService: require("./instructorCourses/instructorCourses.services"),
  dashboardServices: require("./dashboard.services"),,
  assignAssessmentService: require("./assignAssessment/assignAssessment.services"),
  trackingCourseServices: require("./trackingCourse/trackingCourse.services"),
  trackingQuizServices: require("./trackingQuiz/trackingQuiz.services"),
  staffServices: require("./staff/staff.services"),
};
