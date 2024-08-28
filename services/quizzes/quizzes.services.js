const QuizzesModel = require("./quizzes.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
module.exports = {
  createQuiz: async (data) => {
    try {
      const quiz = await QuizzesModel.create(data);
      if (!quiz) throw createError(500, "Error while creating quiz");
      return quiz;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getQuizById: async (id) => {
    try {
      const quiz = await QuizzesModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "questions", // Assuming 'questions' is the collection name
            localField: "questions", // Field in QuizzesModel that holds question IDs
            foreignField: "_id",
            as: "questionsData",
            pipeline: [
              { $match: { active: true } }, // Only include active questions
            ],
          },
        },
        {
          $project: {
            // Include other fields of quiz as necessary
            title: 1,
            description: 1,
            active: 1,
            questionsData: 1,
            totalMarks: 1,
            assessmentId: 1,
            createdAt: 1,
            // other fields...
          },
        },
      ]);

      if (!quiz || quiz.length === 0) throw createError(400, "Invalid quiz id");

      return quiz[0]; // Since aggregate returns an array
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
