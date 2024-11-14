const mongoose = require("mongoose");
const publicLinkSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
      required: true
    },
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
    }
  },
  { timestamps: true, versionKey: false }
);

const publicLinkModel = mongoose.model("publicLink", publicLinkSchema);
module.exports = publicLinkModel;
