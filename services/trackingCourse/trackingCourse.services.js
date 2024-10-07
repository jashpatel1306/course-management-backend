const mongoose = require("mongoose");
const trackingCourseModel = require("./trackingCourse.model");
const createError = require("http-errors");

module.exports = {
  createEnrollCourse: async (userId, courseId) => {
    try {
      // Check if the tracking course already exists for this user and course
      const existingTrackingCourse = await trackingCourseModel.findOne({
        userId,
        courseId,
      });

      // If it exists, throw an error or return a message
      if (existingTrackingCourse) {
        throw createError(400, "User is already enrolled in this course");
      }

      // If it doesn't exist, create a new tracking course
      const data = { userId, courseId };
      const result = await trackingCourseModel.create(data);

      if (!result)
        throw createError(500, "Error while creating tracking course");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  createTrackingCourse: async (data) => {
    try {
      const result = await trackingCourseModel.create(data);
      if (!result)
        throw createError(500, "Error while creating tracking course");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getTrackingCourseById: async (userId, courseId) => {
    try {
      const result = await trackingCourseModel.findOne({
        userId: userId,
        courseId: courseId,
      });
      if (!result) throw createError(400, "Invalid tracking course id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getTrackingCourseByUserId: async (userId) => {
    try {
      const result = await trackingCourseModel.find({
        userId: userId,
      });
      if (!result) throw createError(400, "Invalid tracking course id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  updateTrackingCourse: async (userId, courseId, data) => {
    try {
      const result = await trackingCourseModel.findOneAndUpdate(
        {
          userId: userId,
          courseId: courseId,
        },
        data,
        {
          new: true,
        }
      );
      if (!result) throw createError(400, "Invalid tracking course id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  deleteTrackingCourse: async (id) => {
    try {
      const result = await trackingCourseModel.findOneAndDelete({ _id: id });
      if (!result) throw createError(400, "Invalid tracking course id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  addTrackingContent: async (
    userId,
    courseId,
    totalcontent,
    trackingContent
  ) => {
    try {
      
      // Check if the tracking course exists
      const trackingCourse = await trackingCourseModel.findOne({
        userId: userId, // Convert to ObjectId
        courseId: courseId, // Convert to ObjectId
      });

      if (!trackingCourse) {
        throw createError(400, "Tracking course not found");
      }

      // Check if the content already exists in trackingContent
      const contentExists = trackingCourse.trackingContent.some(
        (content) =>
          content.contentId.toString() === trackingContent.contentId.toString()
      );

      if (contentExists) {
        return trackingCourse;
      }

      // If not exists, add new tracking content
      const result = await trackingCourseModel.findOneAndUpdate(
        {
          userId: userId, // Convert to ObjectId
          courseId: courseId, // Convert to ObjectId
        },
        {
          $push: { trackingContent }, // Adds new content to the array
          $set: { totalcontent: totalcontent }, // Increment totalcontent by 1
        },
        { new: true } // Returns the updated document
      );

      if (!result) throw createError(400, "Invalid tracking course id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  checkContentIdExists: async (userId, courseId, contentId) => {
    try {
      const result = await trackingCourseModel.findOne({
        userId: userId,
        courseId: courseId,
        trackingContent: {
          $elemMatch: { contentId: contentId },
        },
      });

      if (!result) {
        return false; // Content ID does not exist
      }

      return true; // Content ID exists
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
};
