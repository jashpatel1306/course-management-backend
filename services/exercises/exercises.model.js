const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "exercise title is required."]
    },
    description: {
      type: Array
    },
    questions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "exercisquestions"
      }
    ],
    active: {
      type: Boolean,
      default: true
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    assessmentId: {
      type: mongoose.Types.ObjectId,
      ref: "assessments",
      default: null
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    isPublish: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, versionKey: false }
);

ExerciseSchema.post("save", async function (exercise) {
  const assessmentId = exercise.assessmentId;
  if (!assessmentId) {
    return;
  }
  try {
    const assessment = await mongoose.model("assessments").findOneAndUpdate(
      { _id: assessmentId },
      {
        $push: {
          contents: {
            type: "exercise",
            id: exercise._id
          }
        }
      },
      { new: true }
    );
    if (!assessment) {
      throw new Error("Assessment not found");
    }
  } catch (error) {
    console.log("ExerciseSchema save error: ", error);
  }
});

ExerciseSchema.pre("remove", async function (next) {
  const exerciseId = this._id;
  try {
    const assessments = await mongoose
      .model("assessments")
      .updateMany(
        { contents: { $elemMatch: { id: exerciseId } } },
        { $pull: { contents: { id: exerciseId } } }
      );
    if (!assessments) {
      throw new Error("Assessment not found");
    }
  } catch (error) {
    console.log("ExerciseSchema remove error: ", error);
  }
  next();
});
async function calculateTotalMarksAndQuestions(contents) {
  let totalMarks = 0;
  let totalQuestions = 0;

  for (const content of contents) {
    if (content.type === "exercise") {
      const exercise = await mongoose.model("exercises").findById(content.id);
      if (exercise) {
        totalMarks += exercise.totalMarks || 0;
        totalQuestions += exercise.questions?.length || 0;
      }
    }
  }

  return { totalMarks, totalQuestions };
}
ExerciseSchema.post("findOneAndUpdate", async function (exercise) {
  const assessmentId = exercise.assessmentId;
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
    console.log("ExerciseSchema findOneAndUpdate error: ", error);
  }
});
const ExerciseModel = mongoose.model("exercises", ExerciseSchema);
module.exports = ExerciseModel;
