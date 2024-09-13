const { courseServices } = require("../services");
const createError = require("http-errors");
const commonUploadFunction = require("../helpers/fileUpload.helper");

module.exports = {
  /**
   * Create a new Course
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  createCourse: async (req, res, next) => {
    try {
      const image = req.files?.image;
      const request_body = req.body;
      console.log("req.image :", image);
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
      console.log("course: ", course);
      res.send({
        success: true,
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a Course by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
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

  /**
   * Toggle the status of a Course by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
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
      const course = await courseServices.toggleCoursePublicStatus(
        req.params.id
      );
      const message = course.published ? "published" : "unpublished";
      res.status(200).json({
        success: true,
        message: `Course ${message} successfully`,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
  /**
   * Update a Course by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
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

  /**
   * Delete a Course by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
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

  /**
   * Get all Courses by College ID with optional search
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getCoursesByCollegeId: async (req, res, next) => {
    try {
      const { search, pageNo = 1, perPage = 10 } = req.body;
      const college_id = req?.body?.collegeId ? req.body?.collegeId : null;
      const filter = {};
      const userRole = res.locals.userRole;
      // userRole === "student" ? filter.isPublic = true : filter.
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

  /**
   * Get Course Options by College ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
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
};
