const AssignAssessmentsModel = require("./assignAssessment.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const assessmentsModel = require("../assessments/assessments.model");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  createAssignBatchwiseAssessment: async (data) => {
    try {
      data.type = "batch";

      const assessment = await AssignAssessmentsModel.create(data);
      if (!assessment)
        throw createError(500, "Error while creating assessment");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  createAssignCoursewiseAssessment: async (data) => {
    try {
      data.type = "course";
      data.sectionId = data.sectionId ? data.sectionId : null;
      data.lectureId = data.lectureId ? data.lectureId : null;
      if (data.assessmentId && data.batchId) {
        console.log(
          "data.assessmentId && data.batchId: ",
          data.assessmentId,
          data.batchId
        );
        await assessmentsModel.addBatchToAssessment(
          data.assessmentId,
          data.batchId
        );
      }
      const assessment = await AssignAssessmentsModel.create(data);
      if (!assessment)
        throw createError(500, "Error while creating assessment");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  updateAssignAssessment: async (id, data) => {
    try {
      data.courseId = data.courseId ? data.courseId : null;
      data.sectionId = data.sectionId ? data.sectionId : null;
      data.lectureId = data.lectureId ? data.lectureId : null;
      if (data.assessmentId && data.batchId) {
        console.log(
          "data.assessmentId && data.batchId: ",
          data.assessmentId,
          data.batchId
        );
        await assessmentsModel.addBatchToAssessment(
          data.assessmentId,
          data.batchId
        );
      }
      const assessment = await AssignAssessmentsModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true,
        }
      );
      if (!assessment) throw createError(400, "invalid assign assessment id");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  deleteAssignAssessment: async (id) => {
    try {
      const assessment = await AssignAssessmentsModel.findOneAndDelete({
        _id: id,
      });
      if (!assessment) throw createError(400, "invalid assign assessment id");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getAssessmentByBatchId: async (batchId) => {
    try {
      const assessment = await AssignAssessmentsModel.findOne({
        batchId,
        type: "batch",
      }).populate("assessmentId");
      if (!assessment) throw createError(400, "invalid batch id");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getAssessmentByCourseId: async (courseId) => {
    try {
      const assessment = await AssignAssessmentsModel.findOne({
        courseId,
        type: "course",
      }).populate("assessmentId");
      if (!assessment) throw createError(400, "invalid course id");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getAssessmentByBatchIdAndCourseId: async (courseId, batchId) => {
    try {
      const currentDate = new Date(); // Get the current date
      const assessment = await AssignAssessmentsModel.find({
        courseId,
        batchId,
        type: "course",
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
      }).populate("assessmentId");
      if (!assessment) throw createError(400, "invalid course id");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getAllAssignAssessment: async (batchId, perPage, pageNo, collegeId,searchText) => {
    try {
      const filter = {
        $and: [collegeId ? { collegeId } : {}, batchId ? { batchId } : {}],
      };
      const assessments = await AssignAssessmentsModel.find(filter)
        .populate("batchId", "_id batchName")
        .populate("courseId", "_id courseName")
        .populate("assessmentId", "_id title totalQuestions totalMarks")
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await AssignAssessmentsModel.countDocuments(filter);
      if (!assessments)
        throw createError(500, "Error while Fetching assign assessments.");
      return { assessments, count };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
};
