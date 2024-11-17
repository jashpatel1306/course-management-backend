const QuizModel = require("../quizzes/quizzes.model");
const QuestionsModel = require("./questions.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

module.exports = {
  createQuestion: async (data) => {
    try {
      const result = await QuestionsModel.create(data);
      if (!result) throw createError(500, "Error while creating question");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  createQuestionsInBulk: async (questions) => {
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions to insert.");
    }

    const quizId = questions[0].quizId;

    try {
      // Insert multiple questions
      const insertedQuestions = await QuestionsModel.insertMany(questions);

      // Collect inserted question IDs
      const questionIds = insertedQuestions.map((q) => q._id);

      // // Update the quiz with new questions
      const quiz = await QuizModel.findOneAndUpdate(
        { _id: quizId },
        { $push: { questions: { $each: questionIds } } },
        { new: true }
      );

      if (!quiz) {
        throw new Error("Quiz not found.");
      }

      // Update total marks in the quiz
      const totalMarks = await QuestionsModel.aggregate([
        { $match: { quizId: new ObjectId(quizId) } },
        { $group: { _id: "$quizId", totalMarks: { $sum: "$marks" } } }
      ]);
      console.log("totalMarks: ", quizId, totalMarks);
      if (totalMarks.length > 0) {
        await QuizModel.findOneAndUpdate(
          { _id: quizId },
          { totalMarks: totalMarks[0].totalMarks }
        );
      }

      return insertedQuestions;
    } catch (error) {
      console.error(`Error inserting questions: ${error.message}`);
      throw error;
    }
  },
  getQuestionById: async (id) => {
    try {
      const result = await QuestionsModel.findOne({ _id: id });
      if (!result) throw createError(400, "invalid question id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getPublicQuestionById: async (id) => {
    try {
      const result = await QuestionsModel.findOne(
        { _id: id, active: true },
        {
          _id: 1,
          question: 1,
          marks: 1,
          quizId: 1,
          questionType: 1,
          answers: { content: 1, _id: 1 }
        }
      );
      if (!result) throw createError(400, "invalid question id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getQuestionsByQuiz: async (filter, perPage, pageNo) => {
    try {
      const result = await QuestionsModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      if (!result) throw createError(500, "Error while fetching questions");
      const count = await QuestionsModel.countDocuments(filter);
      return { result, count };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  updateQuestion: async (id, data) => {
    try {
      const result = await QuestionsModel.findOneAndUpdate({ _id: id }, data, {
        new: true
      });
      if (!result) throw createError(400, "invalid question id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  deleteQuestion: async (id) => {
    try {
      const result = await QuestionsModel.findOneAndDelete({ _id: id });
      if (!result) throw createError(400, "invalid question id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  activeToggle: async (id) => {
    try {
      const result = await QuestionsModel.findOne({ _id: id });
      if (!result) throw createError(400, "invalid question id");
      result.active = !result.active;
      await result.save();
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  }
};
