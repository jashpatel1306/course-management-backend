const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    },
  },
  { timestamps: true, versionKey: false }
);


QuizSchema.post("save", async function(quiz) {
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
    console.log(error);
  }
});

QuizSchema.pre("remove", async function(next) {
  const quizId = this._id;
  try {
    const assessments = await mongoose.model("assessments").updateMany(
      { contents: { $elemMatch: { id: quizId } } },
      { $pull: { contents: { id: quizId } } }
    );
    if (!assessments) {
      throw new Error("Assessment not found");
    }
  } catch (error) {
    console.log(error);
  }
  next();
});
const QuizModel = mongoose.model("quizzes", QuizSchema);
module.exports = QuizModel;
