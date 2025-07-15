const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: "colleges"
    },
    batches: [
      {
        type: mongoose.Types.ObjectId,
        ref: "batches"
      }
    ],
    type: {
      type: String,
      enum: ["quiz", "exercise"],
      required: true
    },
    contents: [
      {
        type: {
          type: String,
          enum: ["quiz", "exercise"]
        },
        id: {
          type: mongoose.Types.ObjectId
        }
      }
    ],
    totalMarks: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, versionKey: false }
);
// Calculate total marks and questions based on contents
async function calculateTotalMarksAndQuestions(contents) {
  let totalMarks = 0;
  let totalQuestions = 0;

  for (const content of contents) {
    console.log("content.type :::", content.type);
    if (content.type === "quiz") {
      const quiz = await mongoose.model("quizzes").findById(content.id);
      if (quiz) {
        totalMarks += quiz.totalMarks || 0;
        totalQuestions += quiz.questions?.length || 0;
      }
    }
    if (content.type === "exercise") {
      const quiz = await mongoose.model("exercises").findById(content.id);
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
  const { totalMarks, totalQuestions } = await calculateTotalMarksAndQuestions(
    this.contents
  );

  this.totalMarks = totalMarks;
  this.totalQuestions = totalQuestions;

  next();
});
assessmentSchema.statics.addBatchToAssessment = async function (
  assessmentId,
  batchId
) {
  const assessment = await this.findById(assessmentId);
  if (!assessment) {
    throw new Error("Assessment not found");
  }

  // Add batchId to the batches array if it's not already present
  if (!assessment.batches.includes(batchId)) {
    assessment.batches.push(batchId);
    await assessment.save();
  }

  return assessment;
};
const assessmentsModel = mongoose.model("assessments", assessmentSchema);
module.exports = assessmentsModel;
