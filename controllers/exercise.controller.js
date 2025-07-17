const createError = require("http-errors");
const mongoose = require("mongoose");
const {
  exerciseService,
  exerciseQuestionsService,
  trackingExercisesService
} = require("../services");
module.exports = {
  createExercise: async (req, res, next) => {
    try {
      const exercise = await exerciseService.createExercise(req.body);
      return res.status(201).send({
        success: true,
        message: "Exercise created successfully.",
        data: exercise
      });
    } catch (error) {
      next(error);
    }
  },
  updateExercise: async (req, res, next) => {
    try {
      const exerciseId = req.params.id;
      const reqData = req.body;
      const exercise = await exerciseService.updateExercise(
        exerciseId,
        reqData
      );
      return res.status(200).send({
        success: true,
        message: "Exercise updated successfully",
        data: exercise
      });
    } catch (error) {
      next(error);
    }
  },
  getExerciseById: async (req, res, next) => {
    try {
      const exerciseId = req.params.id;
      const exercise = await exerciseService.getExerciseById(exerciseId);
      return res.status(200).send({
        success: true,
        message: "Exercise fetched successfully",
        data: exercise
      });
    } catch (error) {
      next(error);
    }
  },
  getExerciseQuestionById: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const questionData =
        await exerciseQuestionsService.getExerciseQuestionById(questionId);
      return res.status(200).send({
        success: true,
        message: "Exercise question fetched successfully",
        data: questionData
      });
    } catch (error) {
      next(error);
    }
  },
  getStudentExerciseById: async (req, res, next) => {
    try {
      const exerciseId = req.params.id;
      const exercise = await exerciseService.getStudentExerciseById(exerciseId);
      return res.status(200).send({
        success: true,
        message: "Student Exercise fetched successfully",
        data: exercise
      });
    } catch (error) {
      next(error);
    }
  },
  deleteExercise: async (req, res, next) => {
    try {
      const exerciseId = req.params.id;
      const exercise = await exerciseService.toggleActiveStatus(exerciseId);
      return res.status(200).send({
        success: true,
        message: "Exercise deleted successfully",
        data: []
      });
    } catch (error) {
      next(error);
    }
  },
  changeActiveStatusExercise: async (req, res, next) => {
    try {
      const id = req.params.id;
      const exercise = await exerciseService.toggleActiveStatus(id, false);
      const message = exercise.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Exercise ${message} successfully`,
        data: exercise
      });
    } catch (error) {
      next(error);
    }
  },
  getExercisezesByAssessment: async (req, res, next) => {
    try {
      const { pageNo, perPage, status } = req.body;
      const assessmentId = req.params.assessmentId;
      const filter = {
        assessmentId: { $eq: new mongoose.Types.ObjectId(assessmentId) }
      };

      if (status === "active") {
        filter.active = true;
      } else if (status === "inactive") {
        filter.active = false;
      }
      const { exercisezes, count } =
        await exerciseService.getExercisezesByAssessment(
          filter,
          perPage,
          pageNo
        );
      return res.status(200).send({
        success: true,
        message: "Exercisezes fetched successfully",
        data: exercisezes,
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

  getExerciseTrackingResults: async (req, res, next) => {
    try {
      const { trackingId } = req.params;
      const trackingExerciseData =
        await trackingExercisesService.getExerciseResultId(trackingId);
      let result = null;
      let exerciseData = null;

      exerciseData = await exerciseService.getStudentExerciseById(
        trackingExerciseData.exerciseId
      );
      [result] = await exerciseService.getExerciseResult(
        [trackingExerciseData.exerciseId],
        trackingId
      );

      let finalData = result ? result[0] : {};

      finalData = { result, exerciseData };

      return res.status(200).send({
        success: true,
        message: "Exercise tracking results fetched successfully",
        data: finalData
      });
    } catch (error) {
      next(error);
    }
  }
};
