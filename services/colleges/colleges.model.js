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
      required: [true,"college name is required."],
      unique: true,
    },
    shortName: {
      type: String,
      required: [true,"short name is required."]
    },
    collegeNo: {
      type: String,
      required:[true,"college no is required."],
      unique: true,
    },
    contactPersonName: {
      type: String,
      required: [true,"contact person name is required."]
    },
    contactPersonNo: {
      type: String,
      required: [true,"contact person no is required."]
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
