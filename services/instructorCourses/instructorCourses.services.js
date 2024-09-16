const InstructorCourseModel = require("../instructorCourses/instructorCourses"); // Adjust the path as needed
const createError = require("http-errors");
const mongoose = require("mongoose");
module.exports = {
  createInstructorCourse: async (data) => {
    try {
      const course = await InstructorCourseModel.create(data);
      if (!course) {
        throw createError.InternalServerError(
          "Error while creating instructor course."
        );
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  updateInstructorCourse: async (id, data) => {
    try {
      const course = await InstructorCourseModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!course) {
        throw createError.NotFound("Instructor Course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  getInstructorCoursesByCollegeId: async (
    collegeId,
    search,
    pageNo,
    perPage
  ) => {
    try {
      let filter = {
        $or: [{ collegeId: collegeId }, { collegeIds: { $in: [collegeId] } }],
      };
      if (search) {
        filter = {
          $and: [
            {
              $or: [
                { collegeId: collegeId },
                { collegeIds: { $in: [collegeId] } },
              ],
            },
            {
              $or: [
                { courseName: { $regex: search, $options: "i" } },
                { courseDescription: { $regex: search, $options: "i" } },
              ],
            },
          ],
        };
      }

      const courses = await InstructorCourseModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await InstructorCourseModel.countDocuments(filter);

      if (!courses) {
        throw createError.NotFound("No courses found for the given college.");
      }

      return { courses, count };
    } catch (error) {
      throw createError(error);
    }
  },

  getInstructorCourseById: async (id) => {
    try {
      const course = await InstructorCourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Instructor course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  updateInstructorCourse: async (id, data) => {
    try {
      const course = await InstructorCourseModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!course) {
        throw createError.NotFound("Instructor course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  updateInstructorCourseContent: async (courseId, newContent) => {
    try {
      // First check if the contentId exists within the content array
      let lecture = null;
      if (newContent.id) {
        // If the content exists, update the specific item in the array
        lecture = await InstructorCourseModel.updateOne(
          { _id: courseId, "content._id": newContent.id },
          { $set: { "content.$": newContent } }
        );
      } else {
        lecture = await InstructorCourseModel.updateOne(
          { _id: courseId },
          {
            $push: {
              content: [newContent],
            },
          }
        );
      }

      return lecture;
    } catch (err) {
      console.error("Error update Instructor Course Content:", err);
    }
  },
  deleteInstructorCourseContent: async (courseId, contentId) => {
    try {
      const result = await InstructorCourseModel.updateOne(
        { _id: courseId }, // Find the lecture by its _id
        {
          $pull: {
            content: { _id: contentId }, // Remove the item matching the contentId
          },
        }
      );
      console.log("Deleted content result:", result);
      return result;
    } catch (err) {
      console.error("Error deleting lecture content:", err);
    }
  },

  deleteInstructorCourse: async (id) => {
    try {
      const course = await InstructorCourseModel.findByIdAndDelete(id);
      if (!course) {
        throw createError.NotFound("Instructor course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  toggleInstructorCourseStatus: async (id) => {
    try {
      const course = await InstructorCourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Instructor course not found.");
      }

      course.active = !course.active;
      await course.save();

      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  toggleInstructorCoursePublishStatus: async (id) => {
    try {
      const course = await InstructorCourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Instructor course not found.");
      }

      course.isPublish = !course.isPublish;
      await course.save();

      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  getPublishInstructorCourses: async () => {
    try {
      const publishCourses = await InstructorCourseModel.find({
        isPublish: true,
      });
      if (!publishCourses || publishCourses.length === 0) {
        throw createError.NotFound("No publish instructor courses found.");
      }
      return publishCourses;
    } catch (error) {
      throw createError(error);
    }
  },

  assignCourseToCollege: async (courseId, collegeId) => {
    try {
      // Check if the course exists
      const course = await InstructorCourseModel.findById(courseId);

      if (!course) {
        throw new Error("Course not found.");
      }

      // Check if collegeId is already in collegeIds and add it if not
      if (!course.collegeIds.includes(collegeId)) {
        await InstructorCourseModel.updateOne(
          { _id: courseId },
          { $addToSet: { collegeIds: collegeId } }
        );
      }

      return {
        message: "Course ID added to college updated in course successfully.",
      };
    } catch (err) {
      throw createError(err);
    }
  },
  getCollegeCourses: async (collegeId) => {
    try {
      const courses = await InstructorCourseModel.find(
        {
          collegeIds: collegeId,
        },
        {
          collegeIds: 0,
          updatedAt: 0,
        }
      );
      if (!courses || courses.length === 0) {
        throw createError.NotFound("No courses found.");
      }
      return courses;
    } catch (error) {
      throw createError(error);
    }
  },
  getInstructorCourseService: async (collegeId) => {
    try {
      console.log("collegeId : ", collegeId);
      const courses = await InstructorCourseModel.find({
        $and: [
          {
            $or: [
              { collegeId: collegeId },
              { collegeIds: { $in: [collegeId] } },
            ],
          },
          { isPublish: true },
        ],
      });
      console.log("courses : ", courses);
      const data = courses.map((item) => {
        return { label: item.courseName, value: item._id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
};
