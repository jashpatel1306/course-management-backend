const mongoose = require("mongoose");
const createError = require("http-errors");
const { string } = require("joi");

const trackingQuizzesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required."]
    },
    quizId: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
      required: [true, "quiz id is required."]
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    wrongAnswers: {
      type: Number,
      default: 0
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number,
      default: 0
    },
    takenTime: {
      type: Number,
      default: 0
    },
    specificField: {
      type: Object,
      default: {}
    },
    quizType: {
      type: String,
      required: [true, "quiz is required"],
      default: "quiz"
    },
    result: [
      {
        questionId: {
          type: mongoose.Types.ObjectId,
          ref: "questions",
          required: [true, "question is required"]
        },
        answerId: {
          type: mongoose.Types.ObjectId,
          required: [true, "answerId is required"]
        }
      }
    ],
    isSubmit: {
      type: Boolean,
      default: false
    }
  },

  { timestamps: true, versionKey: false }
);

const trackingQuizzeseModel = mongoose.model(
  "trackingquizzes",
  trackingQuizzesSchema
);
module.exports = trackingQuizzeseModel;
