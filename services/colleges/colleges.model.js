const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
      unique: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    collegeNo: {
      type: String,
      required: true,
      unique: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    contactPersonNo: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const CollegeModel = mongoose.model("colleges", collegeSchema);
module.exports = CollegeModel;
