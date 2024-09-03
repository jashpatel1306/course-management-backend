const { instructorServices } = require("../services");
const createError = require("http-errors");

module.exports = {
  /**
   * Create a new Instructor
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  createInstructor: async (req, res, next) => {
    try {
      const instructor = await instructorServices.createInstructor(req.body);
      res.send({
        success: true,
        message: "Instructor created successfully",
        data: instructor,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create Instructors in bulk
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  createBulkInstructors: async (req, res, next) => {
    try {
      const instructors = await instructorServices.createInstructorsInBulk(
        req.body?.instructorsData
      );
      res.send({
        success: true,
        message: "Instructors created successfully",
        data: instructors,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a Instructor by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getInstructorById: async (req, res, next) => {
    try {
      const instructor = await instructorServices.getInstructorById(
        req.params.id
      );
      res.send({
        success: true,
        message: "Instructor fetched successfully",
        data: instructor,
      });
    } catch (error) {
      next(error);
    }
  },

  statusToggle: async (req, res, next) => {
    try {
      const instructor = await instructorServices.statusChange(req.params.id);

      const message = student.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Instructor ${message} successfully`,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a Instructor by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  updateInstructor: async (req, res, next) => {
    try {
      const instructor = await instructorServices.updateInstructor(
        req.params.id,
        req.body
      );
      res.send({
        success: true,
        message: "Instructor updated successfully",
        data: instructor,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a Instructor by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  deleteInstructor: async (req, res, next) => {
    try {
      const instructor = await instructorServices.deleteInstructor(
        req.params.id
      );
      res.send({
        success: true,
        message: "Instructor deleted successfully",
        data: instructor,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all Instructors by College ID with optional search
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getInstructorsByCollegeId: async (req, res, next) => {
    try {
      const { search, pageNo = 1, perPage = 10 } = req.body;
      const college_id =
        req?.body?.collegeId === "all"
          ? req.body?.college_id
          : req.body?.collegeId;

      const { instructors, count } =
        await instructorServices.getInstructorsByCollegeId(
          college_id,
          search,
          pageNo,
          perPage
        );
      res.send({
        success: true,
        message: "Instructors fetched successfully",
        data: instructors,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Instructors Name and ID Mapping by College ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getInstructorsNameIdMappingByCollegeId: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const nameIdMapping =
        await instructorServices.getInstructorsNameIdMappingByCollegeId(
          collegeId
        );
      res.send({
        success: true,
        message: "Instructors name and ID mapping fetched successfully",
        data: nameIdMapping,
      });
    } catch (error) {
      next(error);
    }
  },
  getInstructorsOptions: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const instructors = await instructorServices.getInstructorsOptions(
        collegeId
      );
      res.send({
        success: true,
        message: "instructors fetched successfully",
        data: instructors,
      });
    } catch (error) {
      next(error);
    }
  },
};
