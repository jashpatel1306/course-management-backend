const { instructorCourseService } = require("../services"); // Adjust the path as needed
const createError = require("http-errors");

module.exports = {
  /**
   * Create a new Instructor Course
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createInstructorCourse: async (req, res, next) => {
    try {
      const image = req.files?.image;
      const requestBody = req.body;
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
        if (movetoAWS.data) requestBody.coverImage = movetoAWS.data;
      }
      const course = await instructorCourseService.createInstructorCourse(
        requestBody
      );
      //   console.log("course: ", course);
      res.send({
        success: true,
        message: "Instructor Course created successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  },
  /**
   * Get an Instructor Course by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getInstructorCourseById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const course = await instructorCourseService.getInstructorCourseById(id);
      res.status(200).json({
        success: true,
        message: "Instructor course fetched successfully.",
        data: course,
      });
    } catch (error) {
      next(createError(error));
    }
  },

  /**
   * Update an Instructor Course by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
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

  /**
   * Delete an Instructor Course by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
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

  /**
   * Toggle the 'active' status of an Instructor Course by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  toggleInstructorCourseStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const course = await instructorCourseService.toggleInstructorCourseStatus(
        id
      );
      const message = course.active ? "activated" : "inactivated";

      res.status(200).json({
        success: true,
        message: `course status ${message} successfully.`,
        data: course,
      });
    } catch (error) {
      next(createError(error));
    }
  },

  /**
   * Toggle the 'isPublic' status of an Instructor Course by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  toggleInstructorCoursePublicStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const course =
        await instructorCourseService.toggleInstructorCoursePublicStatus(id);

      const message = course.isPublic ? "published" : "unpublished";

      res.status(200).json({
        success: true,
        message: `Course ${message} successfully`,
        data: [],
      });
    } catch (error) {
      next(createError(error));
    }
  },

  /**
   * Get all public Instructor Courses
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getPublicInstructorCourses: async (req, res, next) => {
    try {
      const courses =
        await instructorCourseService.getPublicInstructorCourses();
      res.status(200).json({
        success: true,
        message: "Public courses fetched successfully.",
        data: courses,
      });
    } catch (error) {
      next(createError(error));
    }
  },

  assignCourseToCollege: async (req, res, next) => {
    try {
      const { id, collegeId } = req.params;
      const course = await instructorCourseService.assignCourseToCollege(
        id,
        collegeId
      );
      res.status(200).json({
        success: true,
        message: "Course assigned to college successfully.",
        data: course,
      });
    } catch (error) {
      next(createError(error));
    }
  },

  getAllCoursesByCollege: async (req, res, next) => {
    try {
      const { collegeId } = req.params;
      const course = await instructorCourseService.getCollegeCourses(collegeId);
      res.status(200).json({
        success: true,
        message: "Course assigned to fetched successfully.",
        data: course,
      });
    } catch (error) {
      next(createError(error));
    }
  },
};
