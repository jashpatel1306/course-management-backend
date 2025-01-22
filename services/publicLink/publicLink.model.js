const mongoose = require("mongoose");
const publicLinkSchema = new mongoose.Schema(
  {
    quizId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "quizzes",
        required: true
      }
    ],
    publicLinkName: {
      type: String,
      required: [true, "publicLink Name is required"]
    },
    password: {
      type: String,
      required: [true, "password is required"]
    },
    noofHits: {
      type: Number,
      required: [true, "hits are required."],
      default: 0
    },
    hits: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      required: [true, "startDate is required"]
    },
    instruction: {
      type: Array
    },
    endDate: {
      type: Date,
      required: [true, "endDate is required"]
    },
    specificField: [
      {
        type: Object
      }
    ],
    active: {
      type: Boolean,
      default: true
    },
    totalTime: {
      type: Number,
      default: 0
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    quizzes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true, versionKey: false }
);
publicLinkSchema.methods.increaseHits = async function () {
  this.hits += 1; // Increment hits by 1
  await this.save(); // Save the updated document
};
publicLinkSchema.post("findOneAndUpdate", async function (data) {
  try {
    const quizzes = await mongoose
      .model("quizzes")
      .find({ _id: { $in: data.quizId } })
      .populate("questions", "_id") // Populate to count questions if needed
      .lean();

    // Initialize totals
    let totalTime = 0;
    let totalMarks = 0;
    let totalQuestions = 0;

    // Calculate totals
    quizzes.forEach((quiz) => {
      totalTime += quiz.time || 0;
      totalMarks += quiz.totalMarks || 0;
      totalQuestions += quiz.questions.length || 0;
    });
    await mongoose.model("publicLink").updateOne(
      { _id: data._id },
      {
        totalTime: totalTime,
        totalMarks: totalMarks,
        totalQuestions: totalQuestions,
        quizzes: quizzes.length
      }
    );
  } catch (error) {
    console.log("publicLinkSchema findOneAndUpdate error: ", error);
  }
});
publicLinkSchema.pre("save", async function (next) {
  try {
    const quizzes = await mongoose
      .model("quizzes")
      .find({ _id: { $in: this.quizId } })
      .populate("questions", "_id") // Populate to count questions if needed
      .lean();

    // Initialize totals
    // let totalTime = 0;
    // let totalMarks = 0;
    // let totalQuestions = 0;

    // Calculate totals
    quizzes.forEach((quiz) => {
      this.totalTime += quiz.time || 0;
      this.totalMarks += quiz.totalMarks || 0;
      this.totalQuestions += quiz.questions.length || 0;
    });
    this.quizzes = quizzes.length;
    console.log("this : ", this);
  } catch (error) {
    console.log("publicLinkSchema pre save error: ", error);
    return next(
      createError.InternalServerError("Error while instructor creation.")
    );
  }
  next();
});
const publicLinkModel = mongoose.model("publicLink", publicLinkSchema);
module.exports = publicLinkModel;
