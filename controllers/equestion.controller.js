const mongoose = require("mongoose");
const { exerciseQuestionsService, exerciseService } = require("../services");

module.exports = {
  createQuestion: async (req, res, next) => {
    try {
      const reqData = req.body;
      const question = await exerciseQuestionsService.createExerciseQuestion(
        reqData
      );
      return res.status(201).send({
        success: true,
        message: "Question created successfully.",
        data: question
      });
    } catch (error) {
      next(error);
    }
  },
  updateQuestion: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const reqData = req.body;
      const question = await exerciseQuestionsService.updateExerciseQuestion(
        questionId,
        reqData
      );
      return res.status(200).send({
        success: true,
        message: "Question updated successfully",
        data: question
      });
    } catch (error) {
      next(error);
    }
  },
  getQuestionById: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const question = await exerciseQuestionsService.getExerciseQuestionById(
        questionId
      );
      return res.status(200).send({
        success: true,
        message: "Question fetched successfully",
        data: question
      });
    } catch (error) {
      next(error);
    }
  },

  deleteQuestion: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const question = await exerciseQuestionsService.deleteExerciseQuestion(
        questionId
      );
      return res.status(200).send({
        success: true,
        message: "Question deleted successfully",
        data: []
      });
    } catch (error) {
      next(error);
    }
  },
  deleteQuestions: async (req, res, next) => {
    try {
      const questionIds = req.body.questionIds;
      const question = await exerciseQuestionsService.deleteExerciseQuestions(
        questionIds
      );
      return res.status(200).send({
        success: true,
        message: "Question deleted successfully",
        data: []
      });
    } catch (error) {
      next(error);
    }
  },

  changeActiveStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const question = await exerciseQuestionsService.activeToggle(id);
      const message = question.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Question ${message} successfully`,
        data: question
      });
    } catch (error) {
      next(error);
    }
  },

  getQuestionsByExercise: async (req, res, next) => {
    try {
      const { pageNo, perPage, status } = req.body;
      const exerciseId = req.params.exerciseId;
      const filter = {
        exerciseId: { $eq: new mongoose.Types.ObjectId(exerciseId) }
      };
      const exerciseData = await exerciseService.getExerciseById(new mongoose.Types.ObjectId(exerciseId));
      if (status === "active") {
        filter.active = true;
      } else if (status === "inactive") {
        filter.active = false;
      }
      const { result, count } =
        await exerciseQuestionsService.getQuestionsByExercise(
          filter,
          perPage,
          pageNo
        );
      return res.status(200).send({
        success: true,
        message: "Questions fetched successfullys",
        data: exerciseData.questions,

        exerciseData: exerciseData,
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
