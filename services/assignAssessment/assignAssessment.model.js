const { string } = require("joi");
const mongoose = require("mongoose");

const assignAssessmentSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: "colleges",
      required: true,
    },
    batchId: {
      type: mongoose.Types.ObjectId,
      ref: "batches",
      required: true,
    },
    type: {
      type: String,
      enum: ["batch", "course"],
      required: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "courses",
      default: null,
    },
    sectionId: {
      type: mongoose.Types.ObjectId,
      ref: "sections",
      default: null,
    },
    lectureId: {
      type: mongoose.Types.ObjectId,
      ref: "lectures",
      default: null,
    },
    assessmentId: {
      type: mongoose.Types.ObjectId,
      ref: "assessments",
      required: true,
    },
    positionType: {
      type: String,
      enum: ["pre", "section", "grand", "batch"],
      default: "batch",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);
assignAssessmentSchema.index(
  { collegeId: 1, batchId: 1, type: 1, courseId: 1, assessmentId: 1 },
  { unique: true }
);

const assignAssessmentsModel = mongoose.model(
  "assignAssessments",
  assignAssessmentSchema
);
module.exports = assignAssessmentsModel;
