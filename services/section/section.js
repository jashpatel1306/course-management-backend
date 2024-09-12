const mongoose = require("mongoose");
const lecturesModel = require("../lectures/lectures");
const CourseModel = require("../courses/course");
const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    lectures: [
      {
        type: {
          type: String,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "lectures",
        },
      },
    ],
    lecturesCount: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

SectionSchema.post("save", async function (section) {
  const id = section._id;

  const updateLectures = await CourseModel.findByIdAndUpdate(id, {
    sections: {  $push:{ name: section.name, id: id } },
    totalSections:{$inc:1}
  });

  if (!updateLectures) console.log("Error setting section array in sections.");
});

const SectionModel = mongoose.model("sections", SectionSchema);
module.exports = SectionModel;
