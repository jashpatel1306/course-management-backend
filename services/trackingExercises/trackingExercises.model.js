const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const trackingExercisesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required."]
    },
    exerciseId: {
      type: mongoose.Types.ObjectId,
      ref: "exercises",
      required: [true, "exercises id is required."]
    },
    assessmentId: {
      type: mongoose.Types.ObjectId,
      ref: "assessments"
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
    result: [
      {
        questionId: {
          type: mongoose.Types.ObjectId,
          ref: "exercisquestions",
          required: [true, "question is required"]
        },
        answer: {
          type: String,
          required: [true, "answer is required"]
        },
        assignMasks: {
          type: Number
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

trackingExercisesSchema.post("findOneAndUpdate", async function (data) {
  const trackingId = data._id;
  if (!trackingId) {
    return;
  }
  try {
    // console.log("data :",data)
    if (data.result) {
      const { result } = data;
      let totalMarks = 0;
      for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const questionResult = await mongoose
          .model("exercisquestions")
          .findOne({
            _id: new ObjectId(item.questionId)
          });

        if (questionResult) {
          totalMarks += questionResult.marks;
        }
      }

      await mongoose.model("trackingExercises").updateOne(
        {
          _id: data._id,
          exerciseId: data.exerciseId
        },
        {
          $set: {
            totalMarks: totalMarks
          }
        }
      );
    }
  } catch (error) {
    console.log("ExerciseSchema findOneAndUpdate error: ", error);
  }
});
const trackingExercisesModel = mongoose.model(
  "trackingexercises",
  trackingExercisesSchema
);
module.exports = trackingExercisesModel;
