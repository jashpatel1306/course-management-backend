const mongoose = require("mongoose");
const createError = require("http-errors");

const trackingQuizzesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required."],
    },
    quizId: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
      required: [true, "quiz id is required."],
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    totalTime: {
      type: Number,
      default: 0,
    },
    result: [
      {
        questionId: {
          type: mongoose.Types.ObjectId,
          ref: "questions",
          required: [true, "question is required"],
        },
        answerId: {
          type: mongoose.Types.ObjectId,
          required: [true, "answerId is required"],
        },
      },
    ],
    isSubmit: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true, versionKey: false }
);

const trackingQuizzeseModel = mongoose.model(
  "trackingquizzes",
  trackingQuizzesSchema
);
module.exports = trackingQuizzeseModel;
