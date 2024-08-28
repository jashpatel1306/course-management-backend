const assessmentServices = require("../services/assessments/assessments.services");
const createError = require("http-errors");
const mongoose = require("mongoose");
module.exports = {
  createAssessment: async (req, res, next) => {
    try {
      const assessment = await assessmentServices.createAssessment(req.body);
      return res.status(201).send({
        success: true,
        message: "Assessment created successfully.",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  },

  updateAssessment: async (req, res, next) => {
    try {
      const assessmentId = req.params.id;
      const reqData = req.body;
      const assessment = await assessmentServices.updateAssessment(
        assessmentId,
        reqData
      );
      return res.status(200).send({
        success: true,
        message: "Assessment updated successfully",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  },
  getAssessmentById: async (req, res, next) => {
    try {
      const assessmentId = req.params.id;
      const assessment = await assessmentServices.getAssessmentById(
        assessmentId
      );
      return res.status(200).send({
        success: true,
        message: "Assessment fetched successfully",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteAssessment: async (req, res, next) => {
    try {
      const assessmentId = req.params.id;
      const assessment = await assessmentServices.deleteAssessment(
        assessmentId
      );
      return res.status(200).send({
        success: true,
        message: "Assessment deleted successfully",
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },

  changeActiveStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const assessment = await assessmentServices.toggleActiveStatus(id);
      const message = assessment.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Assessment ${message} successfully`,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  },

  getAssessmentsByBatch: async (req, res, next) => {
    try {
      const { batchId, pageNo, perPage, status } = req.body;

      const filter = {
        batchId: { $eq: mongoose.Types.ObjectId(batchId) },
      };

      if (status === "active") {
        filter.active = true;
      } else if (status === "inactive") {
        filter.active = false;
      }
      const { assessments, count } =
        await assessmentServices.getAssessmentsByBatch(filter, perPage, pageNo);
      return res.status(200).send({
        success: true,
        message: "Assessments fetched successfully",
        data: assessments,
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
};
