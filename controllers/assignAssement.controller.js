const { assignAssessmentService } = require("../services");
module.exports = {
  createAssignBatchwiseAssessment: async (req, res, next) => {
    try {
      const assessment =
        await assignAssessmentService.createAssignBatchwiseAssessment(req.body);
      return res.status(201).send({
        success: true,
        message: "Assessment assigned successfully.",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  },
  createAssignCoursewiseAssessment: async (req, res, next) => {
    try {
      const assessment =
        await assignAssessmentService.createAssignCoursewiseAssessment(
          req.body
        );
      return res.status(201).send({
        success: true,
        message: "Assessment assigned successfully.",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  },
  updateAssignAssessment: async (req, res, next) => {
    try {
      const assignId = req.params.assignId;
      const reqData = req.body;
      const assessment = await assignAssessmentService.updateAssignAssessment(
        assignId,
        reqData
      );
      return res.status(200).send({
        success: true,
        message: "Assign Assessment updated successfully",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteAssignAssessment: async (req, res, next) => {
    try {
      const assignId = req.params.assignId;
      const assessment = await assignAssessmentService.deleteAssignAssessment(
        assignId
      );
      return res.status(200).send({
        success: true,
        message: "Assign Assessment deleted successfully",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  },
  getAssessmentByBatchId: async (req, res, next) => {
    try {
      const batchId = req.params.batchId;
      const assessment = await assignAssessmentService.getAssessmentByBatchId(
        batchId
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
  getAssessmentByCourseId: async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const assessment = await assignAssessmentService.getAssessmentByCourseId(
        courseId
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
  getAllAssignAssessment: async (req, res, next) => {
    const batchId = req.body?.batchId;
    const perPage = req.body?.perPage;
    const pageNo = req.body?.pageNo;
    const college_id = req?.body?.collegeId
      ? req.body?.collegeId === "all"
        ? req.body?.college_id
        : req.body?.collegeId
      : req.body?.college_id;

    try {
      const { assessments, count } =
        await assignAssessmentService.getAllAssignAssessment(
          batchId === "all" ? "" : batchId,
          perPage,
          pageNo,
          college_id
        );
      return res.status(200).send({
        success: true,
        message: "Assessment fetched successfully",
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
