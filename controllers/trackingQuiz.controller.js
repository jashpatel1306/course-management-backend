const createError = require("http-errors");
const { trackingQuizServices } = require("../services");

module.exports = {
  createEnrollQuiz: async (req, res, next) => {
    try {
      const quizId = req.params.quizId;
      const user_id = req.body?.user_id;

      const trackingQuiz = await trackingQuizServices.createEnrollQuiz(
        user_id,
        quizId
      );
      return res.status(201).send({
        success: true,
        message: "User enrolled in quiz successfully.",
        data: trackingQuiz,
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
        data: trackingQuiz,
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
        data: trackingQuiz,
      });
    } catch (error) {
      next(error);
    }
  },

  getTrackingQuizByUserId: async (req, res, next) => {
    try {
      const user_id = req.body?.user_id;
      const trackingQuiz = await trackingQuizServices.getTrackingQuizByUserId(
        user_id
      );
      return res.status(200).send({
        success: true,
        message: "Tracking quiz fetched successfully.",
        data: trackingQuiz,
      });
    } catch (error) {
      next(error);
    }
  },

  updateQuizTracking: async (req, res, next) => {
    try {
      const quizId = req.params.quizId;
      const userId = req.body?.user_id;
      const updatedData = req.body;
     console.log("updatedData: ",updatedData)
      const trackingQuiz = await trackingQuizServices.updateQuizTracking(
        userId,
        quizId,
        updatedData.questionId,
        updatedData.answerId,
        updatedData.time
      );
      return res.status(200).send({
        success: true,
        message: "Tracking quiz updated successfully.",
        data: trackingQuiz,
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
        data: trackingQuiz,
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
        data: updatedTrackingQuiz,
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
        data: exists,
      });
    } catch (error) {
      next(error);
    }
  },
};
