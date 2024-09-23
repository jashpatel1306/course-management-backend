const QuizzesModel = require("./quizzes.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

module.exports = {
  createQuiz: async (data) => {
    try {
      let quiz;
      if (data.quizId) {
        quiz = await QuizzesModel.findOneAndUpdate({ _id: data.quizId }, data);
      } else {
        quiz = await QuizzesModel.create(data);
      }
      if (!quiz) throw createError(500, "Error while creating quiz");
      return quiz;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getQuizById: async (id) => {
    try {
      // Fetch the quiz and populate questions
      const quiz = await QuizzesModel.findById(id)
        .populate({
          path: "questions",
          match: { active: true }, // Optional: Filter to include only active questions
        })
        .exec();

      if (!quiz) throw new Error("Quiz not found");

      // Reorder questions to match the original order
      // const orderedQuestions = quiz.questions.map((qId) => {
      //   return quiz.questions.find((question) => question._id.equals(qId));
      // });

      // Return the quiz with ordered questions
      return {
        ...quiz.toObject(),
        // questions: orderedQuestions,
      };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getQuizByassessmentId: async (assessmentId) => {
    try {
      // Fetch the quiz and populate questions
      const quiz = await QuizzesModel.find(
        { assessmentId, active: true },
        { _id: 1, title: 1 }
      );
      if (!quiz) throw new Error("assessmentId not found");

      // Reorder questions to match the original order
      // const orderedQuestions = quiz.questions.map((qId) => {
      //   return quiz.questions.find((question) => question._id.equals(qId));
      // });

      // Return the quiz with ordered questions
      return quiz;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getQuizQuestionsById: async (id) => {
    try {
      // Fetch the quiz and populate questions
      const quiz = await QuizzesModel.findById(id)
        .populate({
          path: "questions",
          match: { active: true }, // Optional: Filter to include only active questions
        })
        .exec();

      if (!quiz) throw new Error("Quiz not found");

      // Return the quiz with ordered questions
      return quiz;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  updateQuiz: async (id, data) => {
    try {
      const quiz = await QuizzesModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (!quiz) throw createError(400, "invalid quiz id");
      return quiz;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  deleteQuiz: async (id) => {
    try {
      const quiz = await QuizzesModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      if (!quiz) throw createError(400, "invalid quiz id");
      return quiz;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getQuizzesByAssessment: async (filter, perPage, pageNo) => {
    try {
      const quizzes = await QuizzesModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      if (!quizzes) throw createError(500, "Error while Fetching quizzes.");

      const count = await QuizzesModel.countDocuments(filter);

      return { quizzes, count };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  toggleActiveStatus: async (id, active) => {
    try {
      const quiz = await QuizzesModel.findOne({ _id: id });
      if (!quiz) throw createError(400, "invalid quiz id");

      quiz.active = !quiz.active;
      await quiz.save();
      return quiz;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
};
