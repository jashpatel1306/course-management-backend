const { courseServices } = require("../services");
const createError = require("http-errors");
const commonUploadFunction = require("../helpers/fileUpload.helper");

module.exports = {

  createCourse: async (req, res, next) => {
    try {
      const image = req.files?.image;
      const request_body = req.body;
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
        if (movetoAWS.data) request_body.coverImage = movetoAWS.data;
      }
      const course = await courseServices.createCourse(req.body);
      res.send({
        success: true,
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
  getCourseById: async (req, res, next) => {
    try {
      const course = await courseServices.getCourseById(req.params.id);
      res.send({
        success: true,
        message: "Course fetched successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
  statusToggle: async (req, res, next) => {
    try {
      const course = await courseServices.toggleCourseStatus(req.params.id);
      const message = course.active ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Course ${message} successfully`,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
  publishToggle: async (req, res, next) => {
    try {
      const course = await courseServices.toggleCoursePublishStatus(
        req.params.id
      );
      const message = course.isPublish ? "published" : "unpublished";
      res.status(200).json({
        success: true,
        message: `Course ${message} successfully`,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
   updateCourse: async (req, res, next) => {
    try {
      const image = req.files?.image;
      const request_body = req.body;
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
        if (movetoAWS.data) request_body.coverImage = movetoAWS.data;
      }
      const course = await courseServices.updateCourse(
        req.params.id,
        request_body
      );
      res.send({
        success: true,
        message: "Course updated successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }, 
  deleteCourse: async (req, res, next) => {
    try {
      const course = await courseServices.deleteCourse(req.params.id);
      res.send({
        success: true,
        message: "Course deleted successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
  getCoursesByCollegeId: async (req, res, next) => {
    try {
      const { search, pageNo = 1, perPage = 10 } = req.body;
      const college_id = req?.body?.collegeId ? req.body?.collegeId : null;
      const filter = {};
      const userRole = res.locals.userRole;
      // userRole === "student" ? filter.isPublish = true : filter.
      const { courses, count } = await courseServices.getCoursesByCollegeId(
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
  getCoursesOptions: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const courses = await courseServices.getCourseOptions(collegeId);
      res.send({
        success: true,
        message: "Courses fetched successfully",
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  },
  addAssignCourse: async (req, res, next) => {
    try {
      const ids = req.body;
      const courses = await courseServices.addAssignCourse(
        ids.batchId,
        ids.collegeId,
        ids.courseId
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
  addAssignCourseCollege: async (req, res, next) => {
    try {
      const ids = req.body;
      const courses = await courseServices.addAssignCourseCollege(
        ids.collegeId,
        ids.courseId
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
};
