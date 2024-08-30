const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: "colleges",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    batches: [
      {
        type: mongoose.Types.ObjectId,
        ref: "batches",
      },
    ],
    contents: [
      {
        type: {
          type: String,
          enum: ["quiz", "exercise"],
        },
        id: {
          type: mongoose.Types.ObjectId,
        },
      },
    ],
    totalMarks: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);
// Calculate total marks and questions based on contents
async function calculateTotalMarksAndQuestions(contents) {
  let totalMarks = 0;
  let totalQuestions = 0;

  for (const content of contents) {
    if (content.type === "quiz") {
      const quiz = await mongoose.model("quizzes").findById(content.id);
      if (quiz) {
        totalMarks += quiz.totalMarks || 0;
        totalQuestions += quiz.questions?.length || 0;
      }
    }
  }

  return { totalMarks, totalQuestions };
}
// Pre-save hook to calculate totalMarks and totalQuestions
assessmentSchema.pre("save", async function (next) {
  const { totalMarks, totalQuestions } = await calculateTotalMarksAndQuestions(this.contents);

  this.totalMarks = totalMarks;
  this.totalQuestions = totalQuestions;

  next();
});

const assessmentsModel = mongoose.model("assessments", assessmentSchema);
module.exports = assessmentsModel;
