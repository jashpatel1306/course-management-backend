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
};
