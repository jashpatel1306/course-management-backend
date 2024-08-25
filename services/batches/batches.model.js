const mongoose = require("mongoose");
const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: "colleges",
      required: true,
    },
    trainerIds: [{ type: mongoose.Types.ObjectId }],
    courses: [{ type: mongoose.Types.ObjectId }],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

batchSchema.index({ batchNumber: 1, collegeId: 1 }, { unique: true });

const batchesModel = mongoose.model("batches", batchSchema);
module.exports = batchesModel;
