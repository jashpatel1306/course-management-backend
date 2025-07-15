const mongoose = require("mongoose");
const ExerciseQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required."]
    },
    marks: {
      type: Number,
      required: [true, "marks are required."]
    },
    exerciseId: {
      type: mongoose.Types.ObjectId,
      ref: "exercises",
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    questionType: {
      type: String,
      default: "code"
    }
  },
  { timestamps: true, versionKey: false }
);

ExerciseQuestionsSchema.post("save", async function (question) {
  const { exerciseId } = question;
  try {
    const exercise = await mongoose
      .model("exercises")
      .findOneAndUpdate(
        { _id: exerciseId },
        { $push: { questions: question._id } },
        { new: true }
      );
    console.log("exercise ::::::::::::",exercise)
    handlePostTotalMarkOperation(question);
    if (!exercise) {
      throw new Error("Exercises not found");
    }
  } catch (error) {
    console.log(`Error updating exercise with new question: ${error.message}`);
  }
});

ExerciseQuestionsSchema.post("deleteMany", async function (result) {
  if (!result.deletedCount) return;

  const questionIds = result.deletedDocuments.map((doc) => doc._id);
  try {
    console.log("deleteMany questionIds: ", questionIds);

    const exerciseData = await mongoose
      .model("exercises")
      .updateMany(
        { questions: { $in: questionIds } },
        { $pullAll: { questions: questionIds } }
      );
  } catch (error) {
    console.log(
      `Error updating exercise by removing questions: ${error.message}`
    );
  }
});

ExerciseQuestionsSchema.post("findOneAndDelete", async function (question) {
  if (!question) return;

  const { exerciseId } = question;
  try {
    console.log("findOneAndDelete question: ", question);

    const exerciseData = await mongoose
      .model("exercises")
      .findOneAndUpdate(
        { _id: exerciseId },
        { $pull: { questions: question._id } },
        { new: true }
      );

    handlePostTotalMarkOperation(question);
    if (!exerciseData) {
      throw new Error("Exercises not found");
    }
  } catch (error) {
    console.log(
      `Error updating exercise by removing question: ${error.message}`
    );
  }
});
ExerciseQuestionsSchema.post("findOneAndUpdate", async function (question) {
  if (question) handlePostTotalMarkOperation(question);
});
const handlePostTotalMarkOperation = async function (question) {
  const { exerciseId } = question;
  try {
    console.log("handlePostTotalMarkOperation question: ", question);
    const exerciseData = await mongoose.model("exercisquestions").aggregate([
      {
        $match: {
          exerciseId: new mongoose.Types.ObjectId(exerciseId)
        }
      },
      {
        $group: {
          _id: "$exerciseId",
          totalMarks: { $sum: "$marks" }
        }
      }
    ]);
    console.log("handlePostTotalMarkOperation exerciseData: ", exerciseData);
    const exercise = await mongoose.model("exercises").findOneAndUpdate(
      { _id: exerciseId },
      {
        totalMarks: exerciseData[0]?.totalMarks
          ? exerciseData[0]?.totalMarks
          : 0
      }
    );
    if (!exercise) {
      throw new Error("Exercises not found!");
    }
  } catch (error) {
    console.log(`Error updating exercise with new question: ${error.message}`);
  }
};
const ExerciseQuestionsModel = mongoose.model(
  "exercisquestions",
  ExerciseQuestionsSchema
);
module.exports = ExerciseQuestionsModel;
