const mongoose = require("mongoose");
const createError = require("http-errors");

const trackingCourseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required."],
    },

    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "courses",
      required: [true, "courseId is required."],
    },
    totalcontent: {
      type: Number,
      default: 0,
    },
    trackingContent: [
      {
        contentId: {
          type: mongoose.Types.ObjectId,
        },
        lectureId: {
          type: mongoose.Types.ObjectId,
          ref: "lectures",
        },
      },
    ],
  },

  { timestamps: true, versionKey: false }
);

const trackingCourseModel = mongoose.model(
  "trackingcourse",
  trackingCourseSchema
);
module.exports = trackingCourseModel;
