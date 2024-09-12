const LecturesModel = require("./lectures"); // Adjust the path as needed
const createError = require("http-errors");

module.exports = {
  /**
   * Create a new Lecture
   * @param {Object} data - The Lecture data
   * @returns {Promise<Object>} - The created Lecture
   */
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

  /**
   * Get a Lecture by ID
   * @param {string} id - The ID of the Lecture
   * @returns {Promise<Object>} - The Lecture
   */
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

  /**
   * Update a Lecture by ID
   * @param {string} id - The ID of the Lecture
   * @param {Object} data - The update data
   * @returns {Promise<Object>} - The updated Lecture
   */
  updateLecture: async (id, data) => {
    try {
      const lecture = await LecturesModel.findByIdAndUpdate(id, data, { new: true });
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }
      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Delete a Lecture by ID
   * @param {string} id - The ID of the Lecture
   * @returns {Promise<Object>} - The deleted Lecture
   */
  deleteLecture: async (id) => {
    try {
      const lecture = await LecturesModel.findByIdAndDelete(id);
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }
      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Toggle the 'active' status of a Lecture by ID
   * @param {string} id - The ID of the Lecture
   * @returns {Promise<Object>} - The updated Lecture
   */
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

  /**
   * Toggle the 'public' status of a Lecture by ID
   * @param {string} id - The ID of the Lecture
   * @returns {Promise<Object>} - The updated Lecture
   */
  toggleLecturePublicStatus: async (id) => {
    try {
      const lecture = await LecturesModel.findById(id);
      if (!lecture) {
        throw createError.NotFound("Lecture not found.");
      }

      lecture.isPublic = !lecture.isPublic;
      await lecture.save();

      return lecture;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get all public Lectures
   * @returns {Promise<Array<Object>>} - List of public Lectures
   */
  getPublicLectures: async (sectionId) => {
    try {
      const publicLectures = await LecturesModel.find({ isPublic: true,sectionId });
      if (!publicLectures || publicLectures.length === 0) {
        throw createError.NotFound("No public lectures found.");
      }
      return publicLectures;
    } catch (error) {
      throw createError(error);
    }
  },
};
