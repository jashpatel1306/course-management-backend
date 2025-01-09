const QuizzesModel = require("./quizzes.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

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
  getStudentQuizById: async (id) => {
    try {
      // Fetch the quiz and populate questions with projection
      const quiz = await QuizzesModel.findById(id);
      // .populate({
      //   path: "questions",
      //   match: { active: true }, // Optional: Filter to include only active questions
      //   select: "_id question answers.content answers._id marks" // Specify the fields you want to include
      // })
      // .exec();

      if (!quiz) throw new Error("Quiz not found");

      // Reorder questions to match the original order (if needed)
      // const orderedQuestions = quiz.questions.map((qId) => {
      //   return quiz.questions.find((question) => question._id.equals(qId));
      // });

      // Return the quiz with ordered questions
      return {
        ...quiz.toObject(),
        // questions: orderedQuestions, // Uncomment if reordering is necessary
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
  getQuizzesOptions: async (filter) => {
    try {
      const quiz = await QuizzesModel.find(filter);
      const data = quiz.map((item) => {
        return { label: item.title, value: item._id, time: item.time };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },

  toggleActiveStatus: async (id, active) => {
    try {
      const quiz = await QuizzesModel.findOne({ _id: id });
      if (!quiz) throw createError(400, "invalid quiz id");

      quiz.active = !quiz.active;
      quiz.isPublish = active;
      await quiz.save();
      return quiz;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getQuizResult: async (id, trackingId) => {
    try {
      const quiz = await QuizzesModel.aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $unwind: "$questions",
        },
        {
          $lookup: {
            from: "trackingquizzes",
            let: { questionId: "$questions" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", new ObjectId(trackingId)],
                  },
                },
              },
              {
                $unwind: "$result",
              },
              {
                $match: {
                  $expr: {
                    $eq: ["$result.questionId", "$$questionId"],
                  },
                },
              },
            ],
            as: "result",
          },
        },
        {
          $lookup: {
            from: "questions",
            let: { questionId: "$questions" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$questionId"] },
                },
              },
              {
                $project: {
                  _id: 1,
                  question: 1,
                  answers: 1, // Include the answers for lookup
                  marks: 1,
                },
              },
            ],
            as: "questionData",
          },
        },
        {
          $project: {
            questionId: "$questions",
            totalMarks: 1,
            quizId: { $arrayElemAt: ["$result.quizId", 0] },
            correctAnswers: { $arrayElemAt: ["$result.correctAnswers", 0] },
            wrongAnswers: { $arrayElemAt: ["$result.wrongAnswers", 0] },
            reslutMarks: { $arrayElemAt: ["$result.totalMarks", 0] },
            totalTime: { $arrayElemAt: ["$result.totalTime", 0] },
            takenTime: { $arrayElemAt: ["$result.takenTime", 0] },
            isSubmit: { $arrayElemAt: ["$result.isSubmit", 0] },
            questionData: {
              $arrayElemAt: ["$questionData", 0],
            },
            result: { $arrayElemAt: ["$result", 0] },
          },
        },

        {
          $addFields: {
            "questionData.answerValue": {
              $arrayElemAt: [
                {
                  $filter: {
                    input: { $ifNull: ["$questionData.answers", []] }, // Ensure it's an array
                    as: "answer",
                    cond: { $eq: ["$$answer._id", "$result.result.answerId"] },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $group: {
            _id: 0,
            totalMarks: { $first: "$totalMarks" },
            correctAnswers: { $first: "$correctAnswers" },
            wrongAnswers: { $first: "$wrongAnswers" },
            totalTime: { $first: "$totalTime" },
            takenTime: { $first: "$takenTime" },
            isSubmit: { $first: "isSubmit" },

            results: { $push: "$questionData" },
          },
        },
      ]);
      if (!quiz) throw createError(500, "Error fetching quiz results");
      return quiz;
    } catch (error) {
      throw error;
    }
  },
};
