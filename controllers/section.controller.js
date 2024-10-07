const { sectionServices } = require("../services"); // Adjust the path as needed
const createError = require("http-errors");

module.exports = {
  /**
   * Create a new Section
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  createSection: async (req, res, next) => {
    try {
      const section = await sectionServices.createSection(req.body);
      res.send({
        success: true,
        message: "Section created successfully",
        data: section,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a Section by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getSectionById: async (req, res, next) => {
    try {
      const section = await sectionServices.getSectionById(req.params.id);
      res.send({
        success: true,
        message: "Section fetched successfully",
        data: section,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Toggle the publish status of a Section by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  toggleSectionPublishStatus: async (req, res, next) => {
    try {
      const section = await sectionServices.toggleSectionPublishStatus(
        req.params.id
      );
      const message = section.isPublish ? "published" : "unpublished";
      res.status(200).json({
        success: true,
        message: `Section ${message} successfully`,
        data: section,
      });
    } catch (error) {
      next(error);
    }
  },

  toggleActiveStatus: async (req, res, next) => {
    try {
      const section = await sectionServices.toggleActiveStatus(req.params.id);
      const message = section.active ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Section ${message} successfully`,
        data: section,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a Section by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  updateSection: async (req, res, next) => {
    try {
      const section = await sectionServices.updateSection(
        req.params.id,
        req.body
      );
      res.send({
        success: true,
        message: "Section updated successfully",
        data: section,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a Section by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  deleteSection: async (req, res, next) => {
    try {
      const section = await sectionServices.deleteSection(req.params.id);
      res.send({
        success: true,
        message: "Section deleted successfully",
        data: section,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all Sections by Course ID with optional search
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getSectionsByCourseId: async (req, res, next) => {
    try {
      const courseId = req.params.id;

      const { sections } = await sectionServices.getSectionsByCourseId(
        courseId
      );
      res.send({
        success: true,
        message: "Sections fetched successfully",
        data: sections,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all publish Sections
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getPublishSections: async (req, res, next) => {
    try {
      const sections = await sectionServices.getPublishSections();
      res.send({
        success: true,
        message: "Publish sections fetched successfully",
        data: sections,
      });
    } catch (error) {
      next(error);
    }
  },
};
