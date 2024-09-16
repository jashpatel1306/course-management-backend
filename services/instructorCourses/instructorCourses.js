const mongoose = require("mongoose");

const InstructorCourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      // required: [true, "College ID is required."],
      ref: "colleges",
      default: null,
    },
    coverImage: {
      type: String,
    },
    courseDescription: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    content: [
      {
        type: {
          type: String,
          enum: ["file"],
        },
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
    isPublish: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
    },
    collegeIds: [{ type: mongoose.Types.ObjectId, ref: "colleges" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const InstructorCourseModel = mongoose.model(
  "instructorCourses",
  InstructorCourseSchema
);
module.exports = InstructorCourseModel;
