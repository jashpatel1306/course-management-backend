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
  updateLectureContentDragDrop: async (req, res, next) => {
    try {
      const lecture = await lectureServices.updateLectureDragDrop(
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
  deleteLectureContent: async (req, res, next) => {
    try {
      const lectureId = req.params.lectureId;
      const contentId = req.params.contentId;
      const lecture = await lectureServices.deleteLectureContent(
        lectureId,
        contentId
      );
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
   * Toggle the 'publish' status of a Lecture by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  toggleLecturePublishStatus: async (req, res, next) => {
    try {
      const lecture = await lectureServices.toggleLecturePublishStatus(
        req.params.id
      );
      const message = lecture.isPublish ? "made publish" : "made private";
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
   * Get all publish Lectures
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getPublishLecturesOfCourse: async (req, res, next) => {
    try {
      const lectures = await lectureServices.getPublishLectures();
      res.send({
        success: true,
        message: "Publish lectures fetched successfully",
        data: lectures,
      });
    } catch (error) {
      next(error);
    }
  },
  getSectionLectureOptionsByCourseId: async (req, res, next) => {
    try {
      const sectionId = req.params.sectionId;
      const options = await lectureServices.getSectionLectureOptionsByCourseId(
        sectionId
      );
      res.send({
        success: true,
        message: "Courses sections options fetched successfully",
        data: options,
      });
    } catch (error) {
      next(error);
    }
  },
};
