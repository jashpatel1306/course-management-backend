const mongoose = require("mongoose");
const trackingQuizModel = require("./trackingQuiz.model");
const createError = require("http-errors");
const QuizModel = require("../quizzes/quizzes.model");
const QuestionsModel = require("../questions/questions.model");

module.exports = {
  createEnrollQuiz: async (userId, quizId) => {
    try {
      // Check if the tracking quiz already exists for this user and quiz
      const existingTrackingQuiz = await trackingQuizModel.findOne({
        userId,
        quizId,
      });

      // If it exists, throw an error or return a message
      if (existingTrackingQuiz) {
        throw createError(400, "You have already taken this quiz.");
      }

      // If it doesn't exist, create a new tracking quiz
      const data = { userId, quizId };
      const result = await trackingQuizModel.create(data);

      if (!result) throw createError(500, "Error while creating tracking quiz");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getQuizTrackingById: async (userId, quizId) => {
    try {
      const result = await trackingQuizModel
        .findOne({
          userId,
          quizId,
        })
        .populate({
          path: "result.question",
          select: "question",
        });
      if (!result) throw createError(400, "Invalid quiz tracking id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  updateQuizTracking: async (userId, quizId, questionId, answerId, time) => {
    try {
      console.log(
        "userId, quizId, questionId, answerId : ",
        userId,
        quizId,
        questionId,
        answerId
      );
      const questionResult = await QuestionsModel.findOne({
        _id: questionId,
        answers: {
          $elemMatch: { _id: answerId, correct: true }, // Check if answerId exists in the answers array
        },
      });
      console.log("questionResult : ", questionResult);
      const result = await trackingQuizModel.findOneAndUpdate(
        {
          userId,
          quizId,
        },
        {
          $push: { result: { questionId, answerId } }, // Push new result (question and answerId) to the result array
          $inc: {
            correctAnswers: questionResult ? 1 : 0, // Increment correctAnswers if questionResult is true
            wrongAnswers: questionResult ? 0 : 1, // Increment wrongAnswers if questionResult is false
            totalMarks: questionResult ? questionResult.marks : 0, // Increment totalMarks by the provided value
          },
          $set: {
            totalTime: time,
          },
        },
        {
          new: true, // Return the updated document
        }
      );

      if (!result) throw createError(400, "Invalid quiz tracking id");

      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  submitQuiz: async (userId, quizId, resultData) => {
    try {
      const quizTracking = await trackingQuizModel.findOneAndUpdate(
        {
          userId,
          quizId,
        },
        {
          $set: { result: resultData, isSubmit: true },
        },
        { new: true }
      );
      if (!quizTracking) throw createError(400, "Quiz tracking not found");
      return quizTracking;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  deleteQuizTracking: async (id) => {
    try {
      const result = await trackingQuizModel.findOneAndDelete({ _id: id });
      if (!result) throw createError(400, "Invalid quiz tracking id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  // Check if specific answer exists in quiz tracking
  checkAnswerExists: async (userId, quizId, answerId) => {
    try {
      const result = await trackingQuizModel.findOne({
        userId,
        quizId,
        "result.answerId": answerId,
      });

      return !!result; // Return true if answer exists, otherwise false
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
};
