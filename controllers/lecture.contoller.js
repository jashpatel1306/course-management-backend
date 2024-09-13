const { lectureServices } = require("../services"); // Adjust the path as needed
const createError = require("http-errors");

module.exports = {
  /**
   * Create a new Lecture
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  createLecture: async (req, res, next) => {
    try {
      const lecture = await lectureServices.createLecture(req.body);
      res.send({
        success: true,
        message: "Lecture created successfully",
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a Lecture by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getLectureById: async (req, res, next) => {
    try {
      const lecture = await lectureServices.getLectureById(req.params.id);
      res.send({
        success: true,
        message: "Lecture fetched successfully",
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a Lecture by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  updateLecture: async (req, res, next) => {
    try {
      const lecture = await lectureServices.updateLecture(
        req.params.id,
        req.body
      );
      res.send({
        success: true,
        message: "Lecture updated successfully",
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },
  updateLectureContent: async (req, res, next) => {
    try {
      const lecture = await lectureServices.updateLectureContent(
        req.params.id,
        req.body
      );
      res.send({
        success: true,
        message: "Lecture updated successfully",
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a Lecture by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  deleteLecture: async (req, res, next) => {
    try {
      const lecture = await lectureServices.deleteLecture(req.params.id);
      res.send({
        success: true,
        message: "Lecture deleted successfully",
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Toggle the 'active' status of a Lecture by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  toggleLectureStatus: async (req, res, next) => {
    try {
      const lecture = await lectureServices.toggleLectureStatus(req.params.id);
      const message = lecture.active ? "activated" : "deactivated";
      res.status(200).json({
        success: true,
        message: `Lecture ${message} successfully`,
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Toggle the 'public' status of a Lecture by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  toggleLecturePublicStatus: async (req, res, next) => {
    try {
      const lecture = await lectureServices.toggleLecturePublicStatus(
        req.params.id
      );
      const message = lecture.isPublic ? "made public" : "made private";
      res.status(200).json({
        success: true,
        message: `Lecture ${message} successfully`,
        data: lecture,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all public Lectures
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getPublicLecturesOfCourse: async (req, res, next) => {
    try {
      const lectures = await lectureServices.getPublicLectures();
      res.send({
        success: true,
        message: "Public lectures fetched successfully",
        data: lectures,
      });
    } catch (error) {
      next(error);
    }
  },
};
