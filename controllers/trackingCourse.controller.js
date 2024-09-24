const createError = require("http-errors");
const { trackingCourseServices } = require("../services");

module.exports = {
  createEnrollCourse: async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const user_id = req.body?.user_id;

      const trackingCourse = await trackingCourseServices.createEnrollCourse(
        user_id,
        courseId
      );
      return res.status(201).send({
        success: true,
        message: "User enrolled in course successfully.",
        data: trackingCourse,
      });
    } catch (error) {
      next(error);
    }
  },

  createTrackingCourse: async (req, res, next) => {
    try {
      const trackingCourse = await trackingCourseServices.createTrackingCourse(
        req.body
      );
      return res.status(201).send({
        success: true,
        message: "Tracking course created successfully.",
        data: trackingCourse,
      });
    } catch (error) {
      next(error);
    }
  },

  getTrackingCourseById: async (req, res, next) => {
    try {
      const { userId, courseId } = req.params;
      const trackingCourse = await trackingCourseServices.getTrackingCourseById(
        userId,
        courseId
      );
      return res.status(200).send({
        success: true,
        message: "Tracking course fetched successfully.",
        data: trackingCourse,
      });
    } catch (error) {
      next(error);
    }
  },
  getTrackingCourseByUserId: async (req, res, next) => {
    try {
      const user_id = req.body?.user_id;
      const trackingCourse =
        await trackingCourseServices.getTrackingCourseByUserId(user_id);
      return res.status(200).send({
        success: true,
        message: "Tracking course fetched successfully.",
        data: trackingCourse,
      });
    } catch (error) {
      next(error);
    }
  },

  updateTrackingCourse: async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.body?.user_id;
      const updatedData = req.body;
      const trackingCourse = await trackingCourseServices.addTrackingContent(
        userId,
        courseId,
        updatedData.totalcontent,
        updatedData.trackingContent
      );
      return res.status(200).send({
        success: true,
        message: "Tracking course updated successfully.",
        data: trackingCourse,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteTrackingCourse: async (req, res, next) => {
    try {
      const trackingCourseId = req.params.id;
      const trackingCourse = await trackingCourseServices.deleteTrackingCourse(
        trackingCourseId
      );
      return res.status(200).send({
        success: true,
        message: "Tracking course deleted successfully.",
        data: trackingCourse,
      });
    } catch (error) {
      next(error);
    }
  },

  addTrackingContent: async (req, res, next) => {
    try {
      const { userId, courseId } = req.params;
      const newContent = req.body;
      const updatedTrackingCourse =
        await trackingCourseServices.addTrackingContent(
          userId,
          courseId,
          newContent
        );
      return res.status(200).send({
        success: true,
        message: "Tracking content added successfully.",
        data: updatedTrackingCourse,
      });
    } catch (error) {
      next(error);
    }
  },
};
