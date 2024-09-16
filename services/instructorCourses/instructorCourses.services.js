const InstructorCourseModel = require("../instructorCourses/instructorCourses"); // Adjust the path as needed
const createError = require("http-errors");
const mongoose = require("mongoose");
module.exports = {
  /**
   * Create a new Instructor Course
   * @param {Object} data - The Instructor Course data
   * @returns {Promise<Object>} - The created Instructor Course
   */
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

  /**
   * Get an Instructor Course by ID
   * @param {string} id - The ID of the Instructor Course
   * @returns {Promise<Object>} - The Instructor Course
   */
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

  /**
   * Update an Instructor Course by ID
   * @param {string} id - The ID of the Instructor Course
   * @param {Object} data - The update data
   * @returns {Promise<Object>} - The updated Instructor Course
   */
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

  /**
   * Delete an Instructor Course by ID
   * @param {string} id - The ID of the Instructor Course
   * @returns {Promise<Object>} - The deleted Instructor Course
   */
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

  /**
   * Toggle the 'active' status of an Instructor Course by ID
   * @param {string} id - The ID of the Instructor Course
   * @returns {Promise<Object>} - The updated Instructor Course
   */
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

  /**
   * Toggle the 'isPublish' status of an Instructor Course by ID
   * @param {string} id - The ID of the Instructor Course
   * @returns {Promise<Object>} - The updated Instructor Course
   */
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

  /**
   * Get all publish Instructor Courses
   * @returns {Promise<Array<Object>>} - List of publish Instructor Courses
   */
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

  assignCourseToCollege: async (id, collegeId) => {
    try {
      console.log("id", id, "collegeId", collegeId);
      const assign = await InstructorCourseModel.findByIdAndUpdate(
        id,
        {
          $push: { collegeIds: collegeId },
        },
        { new: true }
      );

      if (!assign) {
        throw createError.BadRequest("Invalid courseId.");
      }
      return assign;
    } catch (err) {
      throw createError(err);
    }
  },
  getCollegeCourses: async (collegeId) => {
    try {
      const courses = await InstructorCourseModel.find({
        collegeIds: collegeId,
      },{
        collegeIds:0,updatedAt:0
      });
      if (!courses || courses.length === 0) {
        throw createError.NotFound("No courses found.");
      }
      return courses;
    } catch (error) {
      throw createError(error);
    }
  },
};
