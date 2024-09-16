const InstructorModel = require("./instructor.model");
const { sendMailWithServices } = require("../../helpers/mail.helper");
const createError = require("http-errors");
const commonFunctions = require("../../helpers/commonFunctions");
const UserService = require("../users/user.service"); // Adjust path as needed
const InstructorCourseModel = require("../instructorCourses/instructorCourses");

module.exports = {
  /**
   * Create a new Instructor
   * @param {Object} data - The Instructor data
   * @returns {Promise<Object>} - The created Instructor
   */
  createInstructor: async (data) => {
    try {
      // Create the Instructor record
      const instructor = await InstructorModel.create(data);
      if (!instructor) {
        throw createError.InternalServerError(
          "Error while creating instructor."
        );
      }
      return instructor;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Create Instructors in bulk
   * @param {Array<Object>} data - Array of Instructor data
   * @returns {Promise<Array<Object>>} - The created Instructors
   */
  createInstructorsInBulk: async (data) => {
    try {
      const instructors = await InstructorModel.insertMany(data);
      if (!instructors) {
        throw createError.InternalServerError(
          "Error while creating instructors."
        );
      }
      return instructors;
    } catch (error) {
      throw createError(error);
    }
  },

  statusChange: async (id) => {
    try {
      const instructor = await InstructorModel.findOne({ _id: id });
      if (!instructor) createError(400, "invalid instructor id.");
      instructor.active = !instructor.active;
      await instructor.save();
      return instructor;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get a Instructor by ID
   * @param {string} id - The ID of the Instructor
   * @returns {Promise<Object>} - The Instructor
   */
  getInstructorById: async (id) => {
    try {
      const instructor = await InstructorModel.findById(id).populate({
        path: "userId",
        select: "_id avatar",
      });
      if (!instructor) {
        throw createError.NotFound("Instructor not found.");
      }
      return instructor;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Update a Instructor by ID
   * @param {string} id - The ID of the Instructor
   * @param {Object} data - The update data
   * @returns {Promise<Object>} - The updated Instructor
   */
  updateInstructor: async (id, data) => {
    try {
      const instructor = await InstructorModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!instructor) {
        throw createError.NotFound("Instructor not found.");
      }
      return instructor;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Delete a Instructor by ID
   * @param {string} id - The ID of the Instructor
   * @returns {Promise<Object>} - The deleted Instructor
   */
  deleteInstructor: async (id) => {
    try {
      const instructor = await InstructorModel.findByIdAndDelete(id);
      if (!instructor) {
        throw createError.NotFound("Instructor not found.");
      }
      return instructor;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get all Instructors with optional search
   * @param {string} [search] - Search term
   * @param {number} [pageNo=1] - Page number
   * @param {number} [perPage=10] - Number of items per page
   * @returns {Promise<Object>} - The instructors and count
   */
  getInstructorsByCollegeId: async (collegeId, search, pageNo, perPage) => {
    try {
      if (!collegeId) {
        throw createError.BadRequest("College ID is required.");
      }

      let filter = { collegeId };

      if (search) {
        filter = {
          $and: [
            { collegeId },
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
              ],
            },
          ],
        };
      }

      const instructors = await InstructorModel.find(filter)
        .populate({
          path: "userId",
          select: "_id avatar",
        })
        .populate("courses", "_id courseName")
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await InstructorModel.countDocuments(filter);

      if (!instructors) {
        throw createError.NotFound(
          "No instructors found for the given college."
        );
      }

      return { instructors, count };
    } catch (error) {
      throw createError(error);
    }
  },
  // getInstructorsNameIdMappingByCollegeId: async (collegeId) => {
  //   try {
  //     if (!collegeId) {
  //       throw createError.BadRequest("College ID is required.");
  //     }

  //     // Find instructors by collegeId
  //     const instructors = await InstructorModel.find({ collegeId });
  //     if (!instructors || instructors.length === 0) {
  //       throw createError.NotFound(
  //         "No instructors found for the given college."
  //       );
  //     }

  //     // Transform the results into key-value pairs
  //     const nameIdMapping = instructors.map((m) => {
  //       return { value: m._id, key: m.name };
  //     });
  //     //   = instructors.reduce((acc, instructor) => {
  //     //     key = instructor._id;
  //     //     // value = acc[instructor.name];
  //     //     return acc;
  //     //   }, {});

  //     return nameIdMapping;
  //   } catch (error) {
  //     throw createError(error);
  //   }
  // },
  getInstructorsOptions: async (collegeId) => {
    try {
      const instructors = await InstructorModel.find({ collegeId });
      const data = instructors.map((item) => {
        return { label: item.name, value: item._id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  getInstructorCourses: async (instructorId) => {
    try {
      const instructorData = await InstructorModel.findOne({
        userId: instructorId,
      });
      if (!instructorData) {
        throw createError(404, "Batches not found");
      }
      console.log("instructorData: ", instructorData);
      const courseIds = instructorData.courses;
      const courses = await InstructorCourseModel.find({
        _id: { $in: courseIds },
      });
      if (!courses) {
        throw createError.NotFound("No courses found for the given college.");
      }

      return { courses };
    } catch (error) {
      throw createError(error);
    }
  },
};
