const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
// Define Course Schema
const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required."],
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      // required: [true, "College ID is required."],
      ref: "colleges",
      default: null,
    },
    courseDescription: {
      type: String,
      required: [true, "Course description is required."],
    },
    coverImage: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    totalSections: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    sections: [
      {
        name: {
          type: String,
        },
        id: {
          type: mongoose.Types.ObjectId,
          ref: "sections",
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
  },
  { timestamps: true, versionKey: false }
);

// CourseSchema.pre("save", async function (next) {
//   next();
// });

// Create and export the Course model
const CourseModel = mongoose.model("courses", CourseSchema);
module.exports = CourseModel;
