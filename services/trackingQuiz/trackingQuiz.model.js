const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

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
    assessmentId: {
      type: mongoose.Types.ObjectId,
      ref: "assessments",
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
        },
        fillAnswer: {
          type: String
        }
      }
    ],
    isSubmit: {
      type: Boolean,
      default: false
    },
    showResult: {
      type: Boolean,
      default: false
    }

  },

  { timestamps: true, versionKey: false }
);

trackingQuizzesSchema.post("findOneAndUpdate", async function (data) {
  const trackingId = data._id;
  if (!trackingId) {
    return;
  }
  try {
    // console.log("data :",data)
    if (data.result) {
      const { result } = data;
      let correctAnswers = 0;
      let wrongAnswers = 0;
      let totalMarks = 0;
      for (let i = 0; i < result.length; i++) {
        const item = result[i];
        let questionResult = null;

        if (item.answerId) {
          questionResult = await mongoose.model("questions").findOne({
            _id: new ObjectId(item.questionId),
            answers: {
              $elemMatch: { _id: new ObjectId(item.answerId), correct: true } // Check if answerId exists in the answers array
            }
          });
        } else {
          questionResult = await mongoose.model("questions").findOne({
            _id: new ObjectId(item.questionId),
            answers: {
              $elemMatch: { content: item.fillAnswer } // Check if answerId exists in the answers array
            }
          });
        }

        if (questionResult) {
          correctAnswers += 1;
          totalMarks += questionResult.marks;
        } else {
          wrongAnswers += 1;
        }
      }

      console.log("correctAnswers: ", correctAnswers);
      console.log("wrongAnswers: ", wrongAnswers);
      console.log("totalMarks: ", totalMarks);
      await mongoose.model("trackingquizzes").updateOne(
        {
          _id: data._id,
          quizId: data.quizId
        },
        {
          $set: {
            correctAnswers: correctAnswers,
            wrongAnswers: wrongAnswers,
            totalMarks: totalMarks
          }
        }
      );
    }
  } catch (error) {
    console.log("QuizSchema findOneAndUpdate error: ", error);
  }
});
const trackingQuizzeseModel = mongoose.model(
  "trackingquizzes",
  trackingQuizzesSchema
);
module.exports = trackingQuizzeseModel;
