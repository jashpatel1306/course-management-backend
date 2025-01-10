const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "quiz title is required."],
    },
    description: {
      type: Array,
    },
    questions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "questions",
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    assessmentId: {
      type: mongoose.Types.ObjectId,
      ref: "assessments",
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    time: {
      type: Number,
      default: 0,
    },
    isPublish: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

QuizSchema.post("save", async function (quiz) {
  const assessmentId = quiz.assessmentId;
  if (!assessmentId) {
    return;
  }
  try {
    const assessment = await mongoose.model("assessments").findOneAndUpdate(
      { _id: assessmentId },
      {
        $push: {
          contents: {
            type: "quiz",
            id: quiz._id,
          },
        },
      },
      { new: true }
    );
    if (!assessment) {
      throw new Error("Assessment not found");
    }
  } catch (error) {
    console.log("QuizSchema save error: ", error);
  }
});

QuizSchema.pre("remove", async function (next) {
  const quizId = this._id;
  try {
    const assessments = await mongoose
      .model("assessments")
      .updateMany(
        { contents: { $elemMatch: { id: quizId } } },
        { $pull: { contents: { id: quizId } } }
      );
    if (!assessments) {
      throw new Error("Assessment not found");
    }
  } catch (error) {
    console.log("QuizSchema remove error: ", error);
  }
  next();
});
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
QuizSchema.post("findOneAndUpdate", async function (quiz) {
  const assessmentId = quiz.assessmentId;
  if (!assessmentId) {
    return;
  }
  try {
    const assessment = await mongoose
      .model("assessments")
      .findOne({ _id: assessmentId });
    const { totalMarks, totalQuestions } =
      await calculateTotalMarksAndQuestions(assessment.contents);
    await mongoose
      .model("assessments")
      .findOneAndUpdate(
        { _id: assessmentId },
        { totalMarks: totalMarks, totalQuestions: totalQuestions }
      );
    if (!assessment) {
      throw new Error("Assessment not found");
    }
  } catch (error) {
    console.log("QuizSchema findOneAndUpdate error: ", error);
  }
});
const QuizModel = mongoose.model("quizzes", QuizSchema);
module.exports = QuizModel;
