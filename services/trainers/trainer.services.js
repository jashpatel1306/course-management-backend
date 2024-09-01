const TrainerModel = require("./trainers.model");
const { sendMailWithServices } = require("../../helpers/mail.helper");
const createError = require("http-errors");
const commonFunctions = require("../../helpers/commonFunctions");
const UserService = require("../users/user.service"); // Adjust path as needed

module.exports = {
  /**
   * Create a new Trainer
   * @param {Object} data - The Trainer data
   * @returns {Promise<Object>} - The created Trainer
   */
  createTrainer: async (data) => {
    try {
      // Create the Trainer record
      const trainer = await TrainerModel.create(data);
      if (!trainer) {
        throw createError.InternalServerError("Error while creating trainer.");
      }
      return trainer;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Create Trainers in bulk
   * @param {Array<Object>} data - Array of Trainer data
   * @returns {Promise<Array<Object>>} - The created Trainers
   */
  createTrainersInBulk: async (data) => {
    try {
      const trainers = await TrainerModel.insertMany(data);
      if (!trainers) {
        throw createError.InternalServerError("Error while creating trainers.");
      }
      return trainers;
    } catch (error) {
      throw createError(error);
    }
  },

  statusChange: async (id) => {
    try {
      const trainer = await TrainerModel.findOne({ _id: id });
      if (!trainer) createError(400, "invalid trainer id.");
      trainer.active = !trainer.active;
      await trainer.save();
      return trainer;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get a Trainer by ID
   * @param {string} id - The ID of the Trainer
   * @returns {Promise<Object>} - The Trainer
   */
  getTrainerById: async (id) => {
    try {
      const trainer = await TrainerModel.findById(id).populate({
        path: "userId",
        select: "_id avatar",
      });
      if (!trainer) {
        throw createError.NotFound("Trainer not found.");
      }
      return trainer;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Update a Trainer by ID
   * @param {string} id - The ID of the Trainer
   * @param {Object} data - The update data
   * @returns {Promise<Object>} - The updated Trainer
   */
  updateTrainer: async (id, data) => {
    try {
      const trainer = await TrainerModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!trainer) {
        throw createError.NotFound("Trainer not found.");
      }
      return trainer;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Delete a Trainer by ID
   * @param {string} id - The ID of the Trainer
   * @returns {Promise<Object>} - The deleted Trainer
   */
  deleteTrainer: async (id) => {
    try {
      const trainer = await TrainerModel.findByIdAndDelete(id);
      if (!trainer) {
        throw createError.NotFound("Trainer not found.");
      }
      return trainer;
    } catch (error) {
      throw createError(error);
    }
  },

  /**
   * Get all Trainers with optional search
   * @param {string} [search] - Search term
   * @param {number} [pageNo=1] - Page number
   * @param {number} [perPage=10] - Number of items per page
   * @returns {Promise<Object>} - The trainers and count
   */
  getTrainersByCollegeId: async (collegeId, search, pageNo, perPage) => {
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

      const trainers = await TrainerModel.find(filter)
        .populate({
          path: "userId",
          select: "_id avatar",
        })
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await TrainerModel.countDocuments(filter);

      if (!trainers) {
        throw createError.NotFound("No trainers found for the given college.");
      }

      return { trainers, count };
    } catch (error) {
      throw createError(error);
    }
  },
  getTrainersNameIdMappingByCollegeId: async (collegeId) => {
    try {
      if (!collegeId) {
        throw createError.BadRequest("College ID is required.");
      }

      // Find trainers by collegeId
      const trainers = await TrainerModel.find({ collegeId })
      if (!trainers || trainers.length === 0) {
        throw createError.NotFound("No trainers found for the given college.");
      }

      // Transform the results into key-value pairs
      const nameIdMapping = trainers.map((m)=>{
        return {value:m._id, key:m.name}
      })
    //   = trainers.reduce((acc, trainer) => {
    //     key = trainer._id;
    //     // value = acc[trainer.name];
    //     return acc;
    //   }, {});

      return nameIdMapping;
    } catch (error) {
      throw createError(error);
    }
  },
};
