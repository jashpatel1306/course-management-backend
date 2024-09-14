const mongoose = require("mongoose");

const InstructorCourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    description: {
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
          enum: ["video", "text"],
        },
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    isPublic: {
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
