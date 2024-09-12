const SectionModel = require("./section"); // Adjust the path as needed
const createError = require("http-errors");

module.exports = {
  /**
   * Create a new Section
   * @param {Object} data - The Section data
   * @returns {Promise<Object>} - The created Section
   */
  createSection: async (data) => {
    try {
      const section = await SectionModel.create(data);
      if (!section) {
        throw createError.InternalServerError("Error while creating section.");
      }
      return section;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get a Section by ID
   * @param {string} id - The ID of the Section
   * @returns {Promise<Object>} - The Section
   */
  getSectionById: async (id) => {
    try {
      const section = await SectionModel.findById(id).populate("courseId").populate("lectures.id");
      if (!section) {
        throw createError.NotFound("Section not found.");
      }
      return section;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Update a Section by ID
   * @param {string} id - The ID of the Section
   * @param {Object} data - The update data
   * @returns {Promise<Object>} - The updated Section
   */
  updateSection: async (id, data) => {
    try {
      const section = await SectionModel.findByIdAndUpdate(id, data, { new: true });
      if (!section) {
        throw createError.NotFound("Section not found.");
      }
      return section;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Delete a Section by ID
   * @param {string} id - The ID of the Section
   * @returns {Promise<Object>} - The deleted Section
   */
  deleteSection: async (id) => {
    try {
      const section = await SectionModel.findByIdAndDelete(id);
      if (!section) {
        throw createError.NotFound("Section not found.");
      }
      return section;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get all Sections for a Course with optional search and pagination
   * @param {string} courseId - Course ID to filter sections
   * @param {string} [search] - Search term
   * @param {number} [pageNo=1] - Page number
   * @param {number} [perPage=10] - Number of items per page
   * @returns {Promise<Object>} - The sections and count
   */
  getSectionsByCourseId: async (courseId, search, pageNo = 1, perPage = 10) => {
    try {
      let filter = { courseId };

      if (search) {
        filter.name = { $regex: search, $options: "i" };
      }

      const sections = await SectionModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await SectionModel.countDocuments(filter);

      if (!sections || sections.length === 0) {
        throw createError.NotFound("No sections found for the given course.");
      }

      return { sections, count };
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Toggle the 'isPublic' status of a Section by ID
   * @param {string} id - The ID of the Section
   * @returns {Promise<Object>} - The updated Section
   */
  toggleSectionPublicStatus: async (id) => {
    try {
      const section = await SectionModel.findById(id);
      if (!section) {
        throw createError.NotFound("Section not found.");
      }

      section.isPublic = !section.isPublic;
      await section.save();

      return section;
    } catch (error) {
      throw createError(error);
    }
  },
  toggleActiveStatus: async (id) => {
    try {
      const section = await SectionModel.findById(id);
      if (!section) {
        throw createError.NotFound("Section not found.");
      }

      section.active = !section.active;
      await section.save();

      return section;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get all public Sections
   * @returns {Promise<Array<Object>>} - List of public sections
   */

 

  getPublicSections: async () => {
    try {
      const publicSections = await SectionModel.find({ isPublic: true });
      if (!publicSections || publicSections.length === 0) {
        throw createError.NotFound("No public sections found.");
      }
      return publicSections;
    } catch (error) {
      throw createError(error);
    }
  },
};
