const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required."]
    },
    answers: [
      {
        content: {
          type: String,
          required: [true, "answer is required"]
        },
        correct: {
          type: Boolean
        },
        reason: {
          type: String
        }
      }
    ],
    marks: {
      type: Number,
      required: [true, "marks are required."]
    },
    quizId: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    questionType: {
      type: String,
      default: "mcq"
    }
  },
  { timestamps: true, versionKey: false }
);

QuestionSchema.post("save", async function (question) {
  const { quizId } = question;
  try {
    const quiz = await mongoose
      .model("quizzes")
      .findOneAndUpdate(
        { _id: quizId },
        { $push: { questions: question._id } },
        { new: true }
      );

    handlePostTotalMarkOperation(question);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
  } catch (error) {
    console.log(`Error updating quiz with new question: ${error.message}`);
  }
});
QuestionSchema.post("findOneAndDelete", async function (question) {
  if (!question) return;

  const { quizId } = question;
  try {
    console.log("findOneAndDelete question: ", question);

    const quizData = await mongoose
      .model("quizzes")
      .findOneAndUpdate(
        { _id: quizId },
        { $pull: { questions: question._id } },
        { new: true }
      );
    console.log("findOneAndDelete quizData : ", quizData);

    handlePostTotalMarkOperation(question);
    if (!quizData) {
      throw new Error("Quiz not found");
    }
  } catch (error) {
    console.log(`Error updating quiz by removing question: ${error.message}`);
  }
});
QuestionSchema.post("findOneAndUpdate", async function (question) {
  if (question) handlePostTotalMarkOperation(question);
});
const handlePostTotalMarkOperation = async function (question) {
  const { quizId } = question;
  try {
    console.log("handlePostTotalMarkOperation question: ", question);
    const quizData = await mongoose.model("questions").aggregate([
      {
        $match: {
          quizId: new mongoose.Types.ObjectId(quizId)
        }
      },
      {
        $group: {
          _id: "$quizId",
          totalMarks: { $sum: "$marks" }
        }
      }
    ]);
    console.log("handlePostTotalMarkOperation quizData: ", quizData);
    const quiz = await mongoose
      .model("quizzes")
      .findOneAndUpdate(
        { _id: quizId },
        { totalMarks: quizData[0]?.totalMarks ? quizData[0]?.totalMarks : 0 }
      );
    if (!quiz) {
      throw new Error("Quiz not found");
    }
  } catch (error) {
    console.log(`Error updating quiz with new question: ${error.message}`);
  }
};
const QuestionsModel = mongoose.model("questions", QuestionSchema);
module.exports = QuestionsModel;
