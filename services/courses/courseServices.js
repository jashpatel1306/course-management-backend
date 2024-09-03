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

  /**
   * Update a Course by ID
   * @param {string} id - The ID of the Course
   * @param {Object} data - The update data
   * @returns {Promise<Object>} - The updated Course
   */
  updateCourse: async (id, data) => {
    try {
      const course = await CourseModel.findByIdAndUpdate(id, data, { new: true });
      if (!course) {
        throw createError.NotFound("Course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Delete a Course by ID
   * @param {string} id - The ID of the Course
   * @returns {Promise<Object>} - The deleted Course
   */
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
      let filter = { collegeId };

      if (search) {
        filter = {
          $and: [
            { collegeId },
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


  toggleCoursePublicStatus: async (id) => {
    try {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }

      course.isPublic = !course.isPublic;
      await course.save();

      return course;
    } catch (error) {
      throw createError(error);
    }
  },


  /**
   * Get all public courses
   * @returns {Promise<Array<Object>>} - List of public courses
   */
  getPublicCourses: async () => {
    try {
      const publicCourses = await CourseModel.find({ isPublic: true });
      if (!publicCourses || publicCourses.length === 0) {
        throw createError.NotFound("No public courses found.");
      }
      return publicCourses;
    } catch (error) {
      throw createError(error);
    }
  },

  getCourseOptions: async (collegeId) => {
    try {
      const course = await CourseModel.find({ collegeId });
      const data = course.map((item) => {
        return { label: item.courseName, value: item._id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  
};
