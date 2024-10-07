const instructorModel = require("../services/instructor/instructor.model");
const studentModel = require("../services/students/student.model");
const courseModel = require("../services/courses/course");
const collegeModel = require("../services/colleges/colleges.model");
const batchModel = require("../services/batches/batches.model");
module.exports = {
  countDocsFromMultipleCollections: async (filter) => {
    try {
      let instructorsFilter = {};
      let studentsFilter = {};
      let batchesFilter = {};
      let coursesFilter = {};

      filter?.instructorsFilter
        ? (instructorsFilter = filter.instructorsFilter)
        : null;
      filter?.studentsFilter ? (studentsFilter = filter.studentsFilter) : null;
      filter?.batchesFilter ? (batchesFilter = filter.batchesFilter) : null;
      filter?.coursesFilter ? (coursesFilter = filter.coursesFilter) : null;

      const [instructors, students, courses, colleges, batches] =
        await Promise.all([
          instructorModel.countDocuments(instructorsFilter),
          studentModel.countDocuments(studentsFilter),
          courseModel.countDocuments(coursesFilter),
          collegeModel.countDocuments({}),
          batchModel.countDocuments(batchesFilter),
        ]);

      return {
        instructors,
        students,
        batches,
        colleges,
        courses,
      };
    } catch (error) {
      throw error;
    }
  },
};
