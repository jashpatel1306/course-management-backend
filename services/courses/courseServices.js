const batchesModel = require("../batches/batches.model");
const CourseModel = require("./course"); // Adjust the path as needed
const createError = require("http-errors");

module.exports = {
  /**
   * Create a new Course
   * @param {Object} data - The Course data
   * @returns {Promise<Object>} - The created Course
   */
  createCourse: async (data) => {
    try {
      const course = await CourseModel.create(data);
      if (!course) {
        throw createError.InternalServerError("Error while creating course.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get a Course by ID
   * @param {string} id - The ID of the Course
   * @returns {Promise<Object>} - The Course
   */
  getCourseById: async (id) => {
    try {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  updateCourse: async (id, data) => {
    try {
      const course = await CourseModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!course) {
        throw createError.NotFound("Course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  deleteCourse: async (id) => {
    try {
      const course = await CourseModel.findByIdAndDelete(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get all Courses with optional search and pagination
   * @param {string} [collegeId] - College ID to filter courses
   * @param {string} [search] - Search term
   * @param {number} [pageNo=1] - Page number
   * @param {number} [perPage=10] - Number of items per page
   * @returns {Promise<Object>} - The courses and count
   */
  getCoursesByCollegeId: async (collegeId, search, pageNo, perPage) => {
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

      const courses = await CourseModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await CourseModel.countDocuments(filter);

      if (!courses) {
        throw createError.NotFound("No courses found for the given college.");
      }

      return { courses, count };
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Toggle the 'active' status of a Course by ID
   * @param {string} id - The ID of the Course
   * @returns {Promise<Object>} - The updated Course
   */
  toggleCourseStatus: async (id) => {
    try {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }

      course.active = !course.active;
      await course.save();

      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  toggleCoursePublishStatus: async (id) => {
    try {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }

      course.isPublish = !course.isPublish;
      await course.save();

      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get all publish courses
   * @returns {Promise<Array<Object>>} - List of publish courses
   */
  getPublishCourses: async () => {
    try {
      const publishCourses = await CourseModel.find({ isPublish: true });
      if (!publishCourses || publishCourses.length === 0) {
        throw createError.NotFound("No publish courses found.");
      }
      return publishCourses;
    } catch (error) {
      throw createError(error);
    }
  },

  getCourseOptions: async (collegeId) => {
    try {
      console.log("collegeId : ", collegeId);
      const courses = await CourseModel.find({
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
  addAssignCourse: async (batchId, collegeId, courseId) => {
    try {
      // Check if the course exists
      const course = await CourseModel.findById(courseId);

      if (!course) {
        throw new Error("Course not found.");
      }

      // Check if collegeId is already in collegeIds and add it if not
      if (!course.collegeIds.includes(collegeId)) {
        await CourseModel.updateOne(
          { _id: courseId },
          { $addToSet: { collegeIds: collegeId } }
        );
      }

      // Find the batch
      const batch = await batchesModel.findOne({
        _id: batchId,
        collegeId: collegeId,
      });

      if (!batch) {
        throw new Error("Batch not found or college ID does not match.");
      }

      // Check if courseId is already in the batch's courses
      if (batch.courses.includes(courseId)) {
        return { message: "Course ID already exists in the batch." };
      }

      // Add courseId to the batch's courses array
      await batchesModel.updateOne(
        { _id: batchId },
        { $addToSet: { courses: courseId } }
      );

      return {
        message:
          "Course ID added to batch and college ID updated in course successfully.",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addAssignCourseCollege: async (collegeId, courseId) => {
    try {
      // Check if the course exists
      const course = await CourseModel.findById(courseId);

      if (!course) {
        throw new Error("Course not found.");
      }

      // Check if collegeId is already in collegeIds and add it if not
      if (!course.collegeIds.includes(collegeId)) {
        await CourseModel.updateOne(
          { _id: courseId },
          { $addToSet: { collegeIds: collegeId } }
        );
      }

      return {
        message: "Course ID added to college updated in course successfully.",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
