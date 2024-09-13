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
        name: {
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
  if (!id) {
    return;
  }
  try {
    const sections = await mongoose.model("sections").find(
      { courseId: section.courseId },
      { name: 1, _id: 1 } // Projection: include only `name` and `_id`
    );

    if (sections.length) {
      const updateLectures = await CourseModel.findByIdAndUpdate(
        section.courseId,
        {
          $set: {
            sections: sections?.map((info) => {
              return { name: info.name, id: info._id };
            }),
            totalSections: sections?.length,
          },
          // $inc: { : 1 },
        },
        { new: true } // Optionally return the updated document
      );
      if (!updateLectures) {
        console.log("Error setting section array in sections.");
      }
    } else {
      console.log("No sections found for this course.");
    }
  } catch (error) {
    console.error("Error updating course:", error);
  }
});

const SectionModel = mongoose.model("sections", SectionSchema);
module.exports = SectionModel;
