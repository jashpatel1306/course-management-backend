const mongoose = require("mongoose");
const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: [true, "batchName is required."],
    },
    batchNumber: {
      type: String,
      default: "",
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: "colleges",
      required: [true, "collegeId is required."],
    },
    instructorIds: [{ type: mongoose.Types.ObjectId, ref: "instructors" }],
    courses: [{ type: mongoose.Types.ObjectId, ref: "courses" }],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

batchSchema.index({ batchName: 1, collegeId: 1 }, { unique: true });

const batchesModel = mongoose.model("batches", batchSchema);
module.exports = batchesModel;
