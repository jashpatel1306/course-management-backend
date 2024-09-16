const createError = require("http-errors");
const { batchServices } = require("../services");

module.exports = {
  createBatch: async (req, res, next) => {
    try {
      const batch = await batchServices.createBatch(req.body);
      res.status(200).send({
        success: true,
        message: "batch created successfully",
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  },
  getBatchById: async (req, res, next) => {
    try {
      const batch = await batchServices.getBatchById(req.params.id);
      res.status(200).send({
        success: true,
        message: "batch fetched successfully",
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllBatches: async (req, res, next) => {
    try {
      college_id =
        req.params.collegeId !== "all"
          ? req.params.collegeId
          : req.body?.college_id;

      const batches = await batchServices.getAllBatchesByCollegeId(college_id);
      res.status(200).send({
        success: true,
        message: "batches fetched successfully",
        data: batches,
      });
    } catch (error) {
      next(error);
    }
  },
  getBatchesOption: async (req, res, next) => {
    try {
      const batches = req.params?.collegeId
        ? await batchServices.getKeyValueBatches(req.params?.collegeId, 1)
        : await batchServices.getKeyValueBatches(req.body?.college_id, 0);
      res.status(200).send({
        success: true,
        message: "batches fetched successfully",
        data: batches,
      });
    } catch (error) {
      next(error);
    }
  },

  updateBatch: async (req, res, next) => {
    try {
      const batch = await batchServices.updateBatch(req.params.id, req.body);
      res.status(200).send({
        success: true,
        message: "batch updated successfully",
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteBatch: async (req, res, next) => {
    try {
      const batch = await batchServices.deleteBatch(req.params.id);
      res.status(200).send({
        success: true,
        message: "batch deleted successfully",
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  },

  activeStatusChange: async (req, res, next) => {
    try {
      const id = req.params.id;
      const batch = await batchServices.activeStatusChange(id);
      const message = batch.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `batch ${message} successfully`,
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  },
  getBatchList: async (req, res, next) => {
    try {
      const batches = await batchServices.getKeyValueBatches();
      res.status(200).send({
        success: true,
        message: "batches fetched successfully",
        data: batches,
      });
    } catch (err) {
      next(err);
    }
  },
  getCoursesByBatchId: async (req, res, next) => {
    try {
      const batch_id = req.body?.batch_id;

      // userRole === "student" ? filter.isPublish = true : filter.
      const { courses } = await batchServices.getCoursesByBatchId(batch_id);
      res.send({
        success: true,
        message: "Courses fetched successfully",
        data: courses,
      });
    } catch (err) {
      next(err);
    }
  },
};
