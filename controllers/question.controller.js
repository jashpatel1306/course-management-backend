const questionServices = require("../services/questions/questions.services");
const createError = require("http-errors");
const mongoose = require("mongoose");
module.exports = {
  createQuestion: async (req, res, next) => {
    try {
      const reqData = req.body;
      const question = await questionServices.createQuestion(reqData);
      return res.status(201).send({
        success: true,
        message: "Question created successfully.",
        data: question,
      });
    } catch (error) {
      next(error);
    }
  },

  updateQuestion: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const reqData = req.body;
      const question = await questionServices.updateQuestion(
        questionId,
        reqData
      );
      return res.status(200).send({
        success: true,
        message: "Question updated successfully",
        data: question,
      });
    } catch (error) {
      next(error);
    }
  },
  getQuestionById: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const question = await questionServices.getQuestionById(questionId);
      return res.status(200).send({
        success: true,
        message: "Question fetched successfully",
        data: question,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteQuestion: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const question = await questionServices.deleteQuestion(questionId);
      return res.status(200).send({
        success: true,
        message: "Question deleted successfully",
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },

  changeActiveStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const question = await questionServices.activeToggle(id);
      const message = question.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Question ${message} successfully`,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  },

  getQuestionsByQuiz: async (req, res, next) => {
    try {
      const { pageNo, perPage, status } = req.body;
      const quizId = req.params.quizId;
      const filter = {
        quizId: { $eq: new mongoose.Types.ObjectId(quizId) },
      };

      if (status === "active") {
        filter.active = true;
      } else if (status === "inactive") {
        filter.active = false;
      }
      const { result, count } = await questionServices.getQuestionsByQuiz(
        filter,
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Questions fetched successfully",
        data: result,
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
