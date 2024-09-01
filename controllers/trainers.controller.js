const trainerServices = require("../services/trainers/trainer.services");
const createError = require("http-errors");

module.exports = {
  /**
   * Create a new Trainer
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  createTrainer: async (req, res, next) => {
    try {
      const trainer = await trainerServices.createTrainer(req.body);
      res.send({
        success: true,
        message: "Trainer created successfully",
        data: trainer,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create Trainers in bulk
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  createBulkTrainers: async (req, res, next) => {
    try {
      const trainers = await trainerServices.createTrainersInBulk(req.body.trainersData);
      res.send({
        success: true,
        message: "Trainers created successfully",
        data: trainers,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a Trainer by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getTrainerById: async (req, res, next) => {
    try {
      const trainer = await trainerServices.getTrainerById(req.params.id);
      res.send({
        success: true,
        message: "Trainer fetched successfully",
        data: trainer,
      });
    } catch (error) {
      next(error);
    }
  },

  statusToggle: async (req, res, next) => {
    try {
      const trainer = await trainerServices.statusChange(req.params.id);
      
      const message = student.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Trainer ${message} successfully`,
        data: student,
      });

      
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a Trainer by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  updateTrainer: async (req, res, next) => {
    try {
      const trainer = await trainerServices.updateTrainer(req.params.id, req.body);
      res.send({
        success: true,
        message: "Trainer updated successfully",
        data: trainer,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a Trainer by ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  deleteTrainer: async (req, res, next) => {
    try {
      const trainer = await trainerServices.deleteTrainer(req.params.id);
      res.send({
        success: true,
        message: "Trainer deleted successfully",
        data: trainer,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all Trainers by College ID with optional search
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getTrainersByCollegeId: async (req, res, next) => {
    try {
      const { search, pageNo = 1, perPage = 10 } = req.body;
      const college_id =
      req.body.collegeId === "all" ? req.body.college_id : req.body.collegeId;

      const { trainers, count } = await trainerServices.getTrainersByCollegeId(
        college_id,
        search,
        pageNo,
        perPage
      );
      res.send({
        success: true,
        message: "Trainers fetched successfully",
        data: trainers,
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
   * Get Trainers Name and ID Mapping by College ID
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   */
  getTrainersNameIdMappingByCollegeId: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const nameIdMapping = await trainerServices.getTrainersNameIdMappingByCollegeId(collegeId);
      res.send({
        success: true,
        message: "Trainers name and ID mapping fetched successfully",
        data: nameIdMapping,
      });
    } catch (error) {
      next(error);
    }
  },
};
