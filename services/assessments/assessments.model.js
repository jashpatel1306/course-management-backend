const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    batches: [
      {
        type: mongoose.Types.ObjectId,
        ref: "batches",
      },
    ],
    contents: [
      {
        type: {
          type: String,
          enum: ["quiz", "exercise"],
        },
        id: {
          type: mongoose.Types.ObjectId,
        },
      },
    ],
    totalMarks: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const assessmentsModel = mongoose.model("assessments", assessmentSchema);
module.exports = assessmentsModel;
