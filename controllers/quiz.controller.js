const createError = require("http-errors");
const mongoose = require("mongoose");
const { quizzesServices } = require("../services");
module.exports = {
  createQuiz: async (req, res, next) => {
    try {
      const quiz = await quizzesServices.createQuiz(req.body);
      return res.status(201).send({
        success: true,
        message: "Quiz created successfully.",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },

  updateQuiz: async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const reqData = req.body;
      const quiz = await quizServices.updateQuiz(quizId, reqData);
      return res.status(200).send({
        success: true,
        message: "Quiz updated successfully",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  getQuizById: async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const quiz = await quizServices.getQuizById(quizId);
      return res.status(200).send({
        success: true,
        message: "Quiz fetched successfully",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteQuiz: async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const quiz = await quizServices.deleteQuiz(quizId);
      return res.status(200).send({
        success: true,
        message: "Quiz deleted successfully",
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },

  changeActiveStatusQuiz: async (req, res, next) => {
    try {
      const id = req.params.id;
      const quiz = await quizServices.toggleActiveStatus(id);
      const message = quiz.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Quiz ${message} successfully`,
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },

  getQuizzesByAssessment: async (req, res, next) => {
    try {
      const { pageNo, perPage, status } = req.body;
      const assessmentId = req.params.assessmentId;
      const filter = {
        assessmentId: { $eq: new mongoose.Types.ObjectId(assessmentId) },
      };

      if (status === "active") {
        filter.active = true;
      } else if (status === "inactive") {
        filter.active = false;
      }
      const { quizzes, count } = await quizServices.getQuizzesByAssessment(
        filter,
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Quizzes fetched successfully",
        data: quizzes,
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
};
