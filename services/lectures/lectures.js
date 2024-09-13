const mongoose = require("mongoose");
const SectionModel = require("../section/section");
const lecturesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
    ref: "sections",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true,
  },
  lectureContent: [
    {
      type: {
        type: String,
        required: true,
        enum: ["video", "text"],
      },
      content: {
        type: String,
        required: true,
      },
      title: {
        type: String,
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  publishDate: {
    type: Date,
  },
});

lecturesSchema.post("save", async function (lecture) {
  const id = lecture._id;
  try {
    const lectures = await mongoose
      .model("lectures")
      .find(
        { sectionId: lecture.sectionId },
        { name: 1, _id: 1 } // Projection: include only `name` and `_id`
      )
      .exec();
    const totalLectures = await mongoose
      .model("lectures")
      .countDocuments({ courseId: lecture.courseId })
      .exec();
    console.log("totalLectures :", totalLectures);
    if (lectures.length) {
      const updateSections = await mongoose
        .model("sections")
        .findByIdAndUpdate(lecture.sectionId, {
          $set: {
            lectures: lectures?.map((info) => {
              return { name: info.name, id: info._id };
            }),
            lecturesCount: lectures?.length,
          },
        });
      const updateCourse = await mongoose
        .model("courses")
        .findByIdAndUpdate(lecture.courseId, {
          $set: {
            totalLectures: totalLectures,
          },
        });
      if (!updateSections) {
        console.log("Error setting section array in lectures.");
      }
    } else {
      console.log("No lectures found for this sections.");
    }
  } catch (err) {
    console.error("Error updating lecture:", err);
  }
});
const lecturesModel = mongoose.model("lectures", lecturesSchema);
module.exports = lecturesModel;
