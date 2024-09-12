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
   * Toggle the public status of a Section by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  togglePublicStatus: async (req, res, next) => {
    try {
      const section = await sectionServices.toggleSectionPublicStatus(req.params.id);
      const message = section.isPublic ? "published" : "unpublished";
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
      const section = await sectionServices.updateSection(req.params.id, req.body);
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
      const { search, pageNo = 1, perPage = 10 } = req.body;
      const { courseId } = req.body;

      const { sections, count } = await sectionServices.getSectionsByCourseId(
        courseId,
        search,
        pageNo,
        perPage
      );
      res.send({
        success: true,
        message: "Sections fetched successfully",
        data: sections,
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
   * Get all public Sections
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getPublicSections: async (req, res, next) => {
    try {
      const sections = await sectionServices.getPublicSections();
      res.send({
        success: true,
        message: "Public sections fetched successfully",
        data: sections,
      });
    } catch (error) {
      next(error);
    }
  },
};
