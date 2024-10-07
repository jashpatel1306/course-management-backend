const { instructorCourseService } = require("../services"); // Adjust the path as needed
const createError = require("http-errors");
const commonUploadFunction = require("../helpers/fileUpload.helper");

module.exports = {
  createInstructorCourse: async (req, res, next) => {
    try {
      const image = req.files?.image;
      const requestBody = req.body;
      if (image) {
        const movetoAWS = await commonUploadFunction.uploadMaterialToAWS(
          image,
          `courses/coverImage/`
        );
        if (!movetoAWS.status)
          return res.json({
            status: false,
            message: movetoAWS.message,
            data: [],
          });
        if (movetoAWS.data) requestBody.coverImage = movetoAWS.data;
      }
      const course = await instructorCourseService.createInstructorCourse(
        requestBody
      );
      res.send({
        success: true,
        message: "Instructor Course created successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
  updateInstructorCourse: async (req, res, next) => {
    try {
      const image = req.files?.image;
      const requestBody = req.body;
      if (image) {
        const movetoAWS = await commonUploadFunction.uploadMaterialToAWS(
          image,
          `courses/coverImage/`
        );
        if (!movetoAWS.status)
          return res.json({
            status: false,
            message: movetoAWS.message,
            data: [],
          });
        if (movetoAWS.data) requestBody.coverImage = movetoAWS.data;
      }
      const course = await instructorCourseService.updateInstructorCourse(
        req.params.id,
        request_body
      );
      res.send({
        success: true,
        message: "Instructor Course updated successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorCoursesByCollegeId: async (req, res, next) => {
    try {
      const { search, pageNo = 1, perPage = 10 } = req.body;
      const college_id = req?.body?.collegeId ? req.body?.collegeId : null;
      const filter = {};
      const { courses, count } =
        await instructorCourseService.getInstructorCoursesByCollegeId(
          college_id,
          search,
          pageNo,
          perPage
        );
      res.send({
        success: true,
        message: "Courses fetched successfully",
        data: courses,
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
  getInstructorCourseById: async (req, res, next) => {
    try {
      const course = await instructorCourseService.getInstructorCourseById(
        req.params.id
      );
      res.send({
        success: true,
        message: "Instructor Course fetched successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
  updateInstructorCourse: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedCourse =
        await instructorCourseService.updateInstructorCourse(id, data);
      res.status(200).json({
        success: true,
        message: "Instructor course updated successfully.",
        data: updatedCourse,
      });
    } catch (error) {
      next(createError(error));
    }
  },
  updateInstructorCourseContent: async (req, res, next) => {
    try {
      const lecture = await instructorCourseService.updateInstructorCourseContent(
        req.params.id,
        req.body
      );
      res.send({
        success: true,
        message: "Course Content updated successfully",
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteInstructorCourseContent: async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const contentId = req.params.contentId;
      const lecture =
        await instructorCourseService.deleteInstructorCourseContent(
          courseId,
          contentId
        );
      res.send({
        success: true,
        message: "Content Deleted Successfully",
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteInstructorCourse: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedCourse =
        await instructorCourseService.deleteInstructorCourse(id);
      res.status(200).json({
        success: true,
        message: "Instructor course deleted successfully.",
        data: [],
      });
    } catch (error) {
      next(createError(error));
    }
  },
  addAssignCourseCollege: async (req, res, next) => {
    try {
      const ids = req.body;
      const courses = await instructorCourseService.assignCourseToCollege(
        ids.courseId,
        ids.collegeId,
      );
      if (courses) {
        return res.status(200).json({
          success: true,
          message: "Course assigned successfully",
          data: courses,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to assign course",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInstructorCoursesOptions: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const courses = await instructorCourseService.getInstructorCourseService(collegeId);
      res.send({
        success: true,
        message: "Courses fetched successfully",
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  },
};
