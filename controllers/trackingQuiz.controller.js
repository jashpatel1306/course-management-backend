const createError = require("http-errors");
const mongoose = require("mongoose");
const {
  trackingQuizServices,
  publicLinkServices,
  studentServices
} = require("../services");
const userService = require("../services/users/user.service");
const { ObjectId } = mongoose.Types;

module.exports = {
  createEnrollQuiz: async (req, res, next) => {
    try {
      const quizId = req.params.quizId;
      const assessmentId = req.params.assessmentId;
      const trackingQuiz = await trackingQuizServices.createEnrollQuiz(
        req.body,
        quizId,
        assessmentId
      );
      return res.status(201).send({
        success: true,
        message: "User enrolled in quiz successfully.",
        data: trackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },
  createPublicEnrollQuiz: async (req, res, next) => {
    try {
      const quizId = req.params.quizId;
      const trackingQuiz = await trackingQuizServices.createEnrollQuiz(
        req.body,
        quizId
      );

      publicLinkServices.increaseHitCount(quizId);
      return res.status(201).send({
        success: true,
        message: "User enrolled in quiz successfully.",
        data: trackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },

  createTrackingQuiz: async (req, res, next) => {
    try {
      const trackingQuiz = await trackingQuizServices.createTrackingQuiz(
        req.body
      );
      return res.status(201).send({
        success: true,
        message: "Tracking quiz created successfully.",
        data: trackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },

  getTrackingQuizById: async (req, res, next) => {
    try {
      const { userId, quizId } = req.params;
      const trackingQuiz = await trackingQuizServices.getTrackingQuizById(
        userId,
        quizId
      );
      return res.status(200).send({
        success: true,
        message: "Tracking quiz fetched successfully.",
        data: trackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },

  getTrackingQuizByUserId: async (req, res, next) => {
    try {
      const user_id = req.body?.user_id;
      const trackingQuiz = await trackingQuizServices.getQuizResultbyUserId(
        user_id
      );
      return res.status(200).send({
        success: true,
        message: "Tracking quiz fetched successfully.",
        data: trackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },

  updateQuizTracking: async (req, res, next) => {
    try {
      const quizId = req.params.quizId;
      const trackingId = req.body?.trackingId;
      const updatedData = req.body;

      const trackingQuiz = await trackingQuizServices.updateQuizTracking(
        trackingId,
        quizId,
        updatedData.questionId,
        updatedData.answerId,
        updatedData.time,
        updatedData.questionType
      );
      return res.status(200).send({
        success: true,
        message: "Tracking quiz updated successfully.",
        data: trackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },

  deleteTrackingQuiz: async (req, res, next) => {
    try {
      const trackingQuizId = req.params.id;
      const trackingQuiz = await trackingQuizServices.deleteTrackingQuiz(
        trackingQuizId
      );
      return res.status(200).send({
        success: true,
        message: "Tracking quiz deleted successfully.",
        data: trackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },

  addQuizResult: async (req, res, next) => {
    try {
      const { userId, quizId } = req.params;
      const resultData = req.body;

      const updatedTrackingQuiz = await trackingQuizServices.addQuizResult(
        userId,
        quizId,
        resultData
      );
      return res.status(200).send({
        success: true,
        message: "Quiz result added successfully.",
        data: updatedTrackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },

  checkAnswerExists: async (req, res, next) => {
    try {
      const { userId, quizId, questionId, answerId } = req.params;

      const exists = await trackingQuizServices.checkAnswerExists(
        userId,
        quizId,
        questionId,
        answerId
      );
      return res.status(200).send({
        success: true,
        message: "Answer check completed.",
        data: exists
      });
    } catch (error) {
      next(error);
    }
  },

  getAllQuizTrackingByUserIds: async (req, res, next) => {
    try {
      const { userIds, batchIds } = req.body;
      const filter = {};

      if (userIds) {
        filter.userIds = userIds.map((userId) => {
          return new ObjectId(userId);
        });
      }

      if (batchIds) {
        filter.batchIds = batchIds.map((batchId) => {
          return new ObjectId(batchId);
        });
      }

      const trackingQuizzes =
        await trackingQuizServices.getAllQuizTrackingByUserId(filter);
      return res.status(200).send({
        success: true,
        message: "Quiz data fetched successfully.",
        data: trackingQuizzes
      });
    } catch (error) {
      next(error);
    }
  },

  getResultContentOfQuiz: async (req, res, next) => {
    try {
      const { trackingId } = req.params;
      const trackingQuiz =
        await trackingQuizServices.getContentOfQuizByTrackingId(trackingId);
      return res.status(200).send({
        success: true,
        message: "Quiz results fetched successfully.",
        data: trackingQuiz
      });
    } catch (error) {
      next(error);
    }
  },
  getAllResultByQuiz: async (req, res, next) => {
    try {
      const { quizId } = req.params;
      const { pageNo, perPage } = req.body;
      const { result, count } = await trackingQuizServices.getAllResultByQuiz(
        quizId,
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Quiz results fetched successfully.",
        data: result,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  },
  getAllResult: async (req, res, next) => {
    try {
      const {
        collegeId,
        batchId,
        assessmentId,
        quizId,
        userId,
        pageNo,
        perPage
      } = req.body;
      const { result, count } = await trackingQuizServices.getAllResult(
        { collegeId, batchId, assessmentId, quizId, userId },
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Quiz results fetched successfully.",
        data: result,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  },
  changesResultVisibility: async (req, res, next) => {
    try {
      // const { trackingId } = req.params;

      const {
        showResult,
        trackingIds
      } = req.body;
      await trackingQuizServices.changesResultVisibility(
        trackingIds, showResult
      );
      return res.status(200).send({
        success: true,
        message: "Quiz result visibility changed successfully.",
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },

  getAllResults: async (req, res, next) => {
    try {
      const { pageNo, perPage } = req.body;
      const { result, count } = await studentServices.getAllResults(
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Quiz results fetched successfully.",
        data: result,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
