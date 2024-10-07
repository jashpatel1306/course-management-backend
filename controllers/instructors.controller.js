const { instructorServices } = require("../services");
const createError = require("http-errors");

module.exports = {
  createInstructor: async (req, res, next) => {
    try {
      const instructor = await instructorServices.createInstructor(req.body);
      res.send({
        success: true,
        message: "Instructor created successfully",
        data: instructor,
      });
    } catch (error) {
      next(error);
    }
  },

  createBulkInstructors: async (req, res, next) => {
    try {
      const instructors = await instructorServices.createInstructorsInBulk(
        req.body?.instructorsData
      );
      res.send({
        success: true,
        message: "Instructors created successfully",
        data: instructors,
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorById: async (req, res, next) => {
    try {
      const instructor = await instructorServices.getInstructorById(
        req.params.id
      );
      res.send({
        success: true,
        message: "Instructor fetched successfully",
        data: instructor,
      });
    } catch (error) {
      next(error);
    }
  },

  statusToggle: async (req, res, next) => {
    try {
      const instructor = await instructorServices.statusChange(req.params.id);

      const message = student.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Instructor ${message} successfully`,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  updateInstructor: async (req, res, next) => {
    try {
      const instructor = await instructorServices.updateInstructor(
        req.params.id,
        req.body
      );
      res.send({
        success: true,
        message: "Instructor updated successfully",
        data: instructor,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteInstructor: async (req, res, next) => {
    try {
      const instructor = await instructorServices.deleteInstructor(
        req.params.id
      );
      res.send({
        success: true,
        message: "Instructor deleted successfully",
        data: instructor,
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorsByCollegeId: async (req, res, next) => {
    try {
      const { search, pageNo = 1, perPage = 10 } = req.body;
      const college_id =
        req?.body?.collegeId === "all" ? null : req.body?.collegeId;

      const { instructors, count } =
        await instructorServices.getInstructorsByCollegeId(
          college_id,
          search,
          pageNo,
          perPage
        );
      res.send({
        success: true,
        message: "Instructors fetched successfully",
        data: instructors,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorsNameIdMappingByCollegeId: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const nameIdMapping =
        await instructorServices.getInstructorsNameIdMappingByCollegeId(
          collegeId
        );
      res.send({
        success: true,
        message: "Instructors name and ID mapping fetched successfully",
        data: nameIdMapping,
      });
    } catch (error) {
      next(error);
    }
  },
  getInstructorsOptions: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const instructors = await instructorServices.getInstructorsOptions(
        collegeId
      );
      res.send({
        success: true,
        message: "instructors fetched successfully",
        data: instructors,
      });
    } catch (error) {
      next(error);
    }
  },
  getInstructorCourses: async (req, res, next) => {
    try {
      const instructor_id = req.body?.user_id;

      // userRole === "student" ? filter.isPublish = true : filter.
      const { courses } = await instructorServices.getInstructorCourses(
        instructor_id
      );
      res.send({
        success: true,
        message: "Instructor Courses fetched successfully",
        data: courses,
      });
    } catch (err) {
      next(err);
    }
  },
};
