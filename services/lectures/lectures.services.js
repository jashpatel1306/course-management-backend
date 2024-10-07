const SectionModel = require("../section/section");
const LecturesModel = require("./lectures"); // Adjust the path as needed
const createError = require("http-errors");

module.exports = {
  createLecture: async (data) => {
    try {
      const lecture = await LecturesModel.create(data);
      if (!lecture) {
        throw createError.InternalServerError("Error while creating lecture.");
      }
      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },

  getLectureById: async (id) => {
    try {
      const lecture = await LecturesModel.findById(id);
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }
      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },

  updateLectureContent: async (lectureId, newContent) => {
    try {
      // First check if the contentId exists within the lectureContent array
      let lecture = null;
      if (newContent.id) {
        // If the content exists, update the specific item in the array
        lecture = await LecturesModel.updateOne(
          { _id: lectureId, "lectureContent._id": newContent.id },
          { $set: { "lectureContent.$": newContent } }
        );
      } else {
        // If the contentId doesn't exist, push a new content item into the array
        lecture = await LecturesModel.updateOne(
          { _id: lectureId },
          {
            $push: {
              lectureContent: [newContent],
            },
          }
        );
      }
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }
      return lecture;
    } catch (err) {
      console.error("Error upserting lecture content:", err);
    }
  },
  updateLecture: async (id, data) => {
    try {
      const lecture = await LecturesModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      await SectionModel.findOneAndUpdate(
        { _id: data.sectionId, "lectures.id": id }, // Query filter
        {
          $set: { "lectures.$.name": data.name }, // Update operation
        },
        { new: true, runValidators: true } // Options: return updated doc and validate
      );
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }
      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },
  updateLectureDragDrop: async (id, data) => {
    try {
      const lecture = await LecturesModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }
      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },
  deleteLecture: async (id) => {
    try {
      // Find the lecture by id and delete it
      const lecture = await LecturesModel.findOne({ _id: id });
      if (lecture.sectionId) {
        await SectionModel.findOneAndUpdate(
          { _id: lecture.sectionId, "lectures.id": id }, // Query filter
          {
            $pull: { lectures: { id: id } }, // Update operation
          },
          { new: true, runValidators: true } // Options: return updated doc and validate
        );
        await LecturesModel.deleteOne({ _id: id });
      }
      return true;
    } catch (error) {
      // Re-throw the error if it's an instance of createError, or create a new internal server error
      if (!error.status) {
        throw createError(
          500,
          `An error occurred while deleting the lecture.${error}`
        );
      } else {
        throw error;
      }
    }
  },
  deleteLectureContent: async (lectureId, contentId) => {
    try {
      const result = await LecturesModel.updateOne(
        { _id: lectureId }, // Find the lecture by its _id
        {
          $pull: {
            lectureContent: { _id: contentId }, // Remove the item matching the contentId
          },
        }
      );
      return result;
    } catch (err) {
      console.error("Error deleting lecture content:", err);
    }
  },
  toggleLectureStatus: async (id) => {
    try {
      const lecture = await LecturesModel.findById(id);
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }

      lecture.active = !lecture.active;

      await lecture.save();

      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },

  toggleLecturePublishStatus: async (id) => {
    try {
      const lecture = await LecturesModel.findById(id);
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }
      const newObject = {};
      newObject.isPublish = !lecture.isPublish;
      if (lecture.isPublish) {
        newObject.publishDate = new Date();
      }
      const updateLecture = await LecturesModel.updateOne(
        { _id: id },
        { $set: newObject }
      );

      return updateLecture;
    } catch (error) {
      throw createError(error);
    }
  },

  getPublishLectures: async (sectionId) => {
    try {
      const publishLectures = await LecturesModel.find({
        isPublish: true,
        sectionId,
      });
      if (!publishLectures || publishLectures.length === 0) {
        throw createError.NotFound("No publish lectures found.");
      }
      return publishLectures;
    } catch (error) {
      throw createError(error);
    }
  },
  getSectionLectureOptionsByCourseId: async (sectionId) => {
    try {
      const lectures = await LecturesModel.find({
        sectionId: sectionId,
        isPublish: true,
      });
      const data = lectures.map((item) => {
        return { label: item.name, value: item._id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  getPublishLectureDataById: async (id) => {
    try {
      const lecture = await LecturesModel.findOne({
        _id: id,
        isPublish: true,
      });
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }
      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },
};
