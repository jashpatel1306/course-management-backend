const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answers: [
      {
        content: {
          type: String,
          required: true,
        },
        correct: {
          type: Boolean,
        },
        reason: {
          type: String,
        },
      },
    ],
    marks: {
      type: Number,
      required: true,
    },
    quizId: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);


QuestionSchema.post("save", async function(question) {
  const { quizId } = question;
  try {
    const quiz = await mongoose.model("quizzes").findOneAndUpdate(
      { _id: quizId },
      { $push: { questions: question._id } },
      { new: true }
    );
    if (!quiz) {
      throw new Error("Quiz not found");
    }
  } catch (error) {
    console.log(`Error updating quiz with new question: ${error.message}`);
  }
});

const QuestionsModel = mongoose.model("questions", QuestionSchema);
module.exports = QuestionsModel;
