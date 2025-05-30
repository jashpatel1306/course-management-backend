const createError = require("http-errors");
const mongoose = require("mongoose");
const { assessmentServices, assignAssessmentService } = require("../services");
module.exports = {
  createAssessment: async (req, res, next) => {
    try {
      const assessment = await assessmentServices.createAssessment(req.body);
      return res.status(201).send({
        success: true,
        message: "Assessment created successfully.",
        data: assessment
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
        data: assessment
      });
    } catch (error) {
      next(error);
    }
  },
  getAssessmentById: async (req, res, next) => {
    try {
      const assessmentId = req.params.id;
      const userId = req.body?.user_id;

      const assessment = await assessmentServices.getAssessmentById(
        assessmentId,
        userId
      );
      return res.status(200).send({
        success: true,
        message: "Assessment fetched successfully",
        data: assessment
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
        data: []
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
        data: assessment
      });
    } catch (error) {
      next(error);
    }
  },

  getAssessmentsByBatch: async (req, res, next) => {
    try {
      const batchId = req.body?.batchId;
      const perPage = req.body?.perPage;
      const pageNo = req.body?.pageNo;
      const search = req.body?.search;
      const college_id = req?.body?.collegeId
        ? req.body?.collegeId === "all"
          ? req.body?.college_id
          : req.body?.collegeId
        : req.body?.college_id;
      const searchText = new RegExp(search, `i`);

      const { assessments, count } =
        await assessmentServices.getAssessmentsByBatch(
          searchText,
          perPage,
          pageNo,
          batchId,
          college_id
        );
      return res.status(200).send({
        success: true,
        message: "Assessments fetched successfully",
        data: assessments,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  },
  getAssessmentsByStudentId: async (req, res, next) => {
    try {
      const college_id = req.body?.college_id;
      const batchId = req.body?.batch_id;
      const searchText = new RegExp(req.body?.search, `i`);
      const perPage = req.body?.perPage;
      const pageNo = req.body?.pageNo;
      const status = req.body?.status;
      const { assessments, count } =
        await assignAssessmentService.getStudentsAllAssignAssessment(
          batchId === "all" ? "" : batchId,
          perPage,
          pageNo,
          college_id,
          searchText,
          status
        );
      return res.status(200).send({
        success: true,
        message: "Assessments fetched successfully",
        data: assessments,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  },
  getAssessmentOptionsByCollegeId: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const assessment =
        await assessmentServices.getAssessmentOptionsByCollegeId(collegeId);
      return res.status(200).send({
        success: true,
        message: "Assessment option fetched successfully",
        data: assessment
      });
    } catch (error) {
      next(error);
    }
  }
};
