const mongoose = require("mongoose");
const {
  trackingExercisesService,
  exerciseService,
  studentServices
} = require("../services");
const { ObjectId } = mongoose.Types;

module.exports = {
  createEnrollExercise: async (req, res, next) => {
    try {
      const exerciseId = req.params.exerciseId;
      const assessmentId = req.params.assessmentId;
      const existingEntry = await exerciseService.getExerciseById(exerciseId);
      const trackingExercise =
        await trackingExercisesService.createEnrollExercise(
          req.body,
          exerciseId,
          assessmentId,
          existingEntry.totalMarks
        );
      return res.status(201).send({
        success: true,
        message: "User enrolled in exercise successfully.",
        data: trackingExercise
      });
    } catch (error) {
      next(error);
    }
  },
  createTrackingExercise: async (req, res, next) => {
    try {
      const trackingExercise =
        await trackingExercisesService.createTrackingExercise(req.body);
      return res.status(201).send({
        success: true,
        message: "Tracking exercise created successfully.",
        data: trackingExercise
      });
    } catch (error) {
      next(error);
    }
  },

  getTrackingExerciseById: async (req, res, next) => {
    try {
      const { userId, exerciseId } = req.params;
      const trackingExercise =
        await trackingExercisesService.getTrackingExerciseById(
          userId,
          exerciseId
        );
      return res.status(200).send({
        success: true,
        message: "Tracking exercise fetched successfully.",
        data: trackingExercise
      });
    } catch (error) {
      next(error);
    }
  },

  getTrackingExerciseByUserId: async (req, res, next) => {
    try {
      const user_id = req.body?.user_id;
      const trackingExercise =
        await trackingExercisesService.getTrackingExerciseByUserId(user_id);
      return res.status(200).send({
        success: true,
        message: "Tracking exercise fetched successfully.",
        data: trackingExercise
      });
    } catch (error) {
      next(error);
    }
  },

  updateExerciseTracking: async (req, res, next) => {
    try {
      const exerciseId = req.params.exerciseId;
      const trackingId = req.body?.trackingId;
      const updatedData = req.body;

      const trackingExercise =
        await trackingExercisesService.updateExerciseTracking(
          trackingId,
          exerciseId,
          updatedData.questionId,
          updatedData.answerId,
          updatedData.isSubmit
        );
      return res.status(200).send({
        success: true,
        message: "Tracking exercise updated successfully.",
        data: trackingExercise
      });
    } catch (error) {
      next(error);
    }
  },

  deleteTrackingExercise: async (req, res, next) => {
    try {
      const trackingExerciseId = req.params.id;
      const trackingExercise =
        await trackingExercisesService.deleteTrackingExercise(
          trackingExerciseId
        );
      return res.status(200).send({
        success: true,
        message: "Tracking exercise deleted successfully.",
        data: trackingExercise
      });
    } catch (error) {
      next(error);
    }
  },

  updateExerciseResult: async (req, res, next) => {
    try {
      const { id } = req.params;
      const resultData = req.body;

      const updatedTrackingExercise =
        await trackingExercisesService.updateResultTrackingExercise(
          id,
          resultData
        );
      return res.status(200).send({
        success: true,
        message: "Exercise result added successfully.",
        data: updatedTrackingExercise
      });
    } catch (error) {
      next(error);
    }
  },

  checkAnswerExists: async (req, res, next) => {
    try {
      const { userId, exerciseId, questionId, answerId } = req.params;

      const exists = await trackingExercisesService.checkAnswerExists(
        userId,
        exerciseId,
        questionId,
        answerId
      );
      return res.status(200).send({
        success: true,
        message: "Answer check completed.",
        data: exists
      });
    } catch (error) {
      next(error);
    }
  },

  getAllExerciseTrackingByUserIds: async (req, res, next) => {
    try {
      const { userIds, batchIds } = req.body;
      const filter = {};

      if (userIds) {
        filter.userIds = userIds.map((userId) => {
          return new ObjectId(userId);
        });
      }

      if (batchIds) {
        filter.batchIds = batchIds.map((batchId) => {
          return new ObjectId(batchId);
        });
      }

      const trackingExercisezes =
        await trackingExercisesService.getAllExerciseTrackingByUserId(filter);
      return res.status(200).send({
        success: true,
        message: "Exercise data fetched successfully.",
        data: trackingExercisezes
      });
    } catch (error) {
      next(error);
    }
  },

  getResultContentOfExercise: async (req, res, next) => {
    try {
      const { trackingId } = req.params;
      const trackingExercise =
        await trackingExercisesService.getContentOfExerciseByTrackingId(
          trackingId
        );
      return res.status(200).send({
        success: true,
        message: "Exercise results fetched successfully.",
        data: trackingExercise
      });
    } catch (error) {
      next(error);
    }
  },
  getAllResultByExercise: async (req, res, next) => {
    try {
      const { exerciseId } = req.params;
      const { pageNo, perPage } = req.body;
      const { result, count } =
        await trackingExercisesService.getAllResultByExercise(
          exerciseId,
          perPage,
          pageNo
        );
      return res.status(200).send({
        success: true,
        message: "Exercise results fetched successfully.",
        data: result,
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
  getAllResult: async (req, res, next) => {
    try {
      const {
        collegeId,
        batchId,
        assessmentId,
        exerciseId,
        userId,
        pageNo,
        perPage
      } = req.body;
      const { result, count } = await trackingExercisesService.getAllResult(
        { collegeId, batchId, assessmentId, exerciseId, userId },
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Exercise results fetched successfully.",
        data: result,
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
  changesResultVisibility: async (req, res, next) => {
    try {
      // const { trackingId } = req.params;

      const { showResult, trackingIds } = req.body;
      await trackingExercisesService.changesResultVisibility(
        trackingIds,
        showResult
      );
      return res.status(200).send({
        success: true,
        message: "Exercise result visibility changed successfully.",
        data: []
      });
    } catch (error) {
      next(error);
    }
  },

  getAllResults: async (req, res, next) => {
    try {
      const { pageNo, perPage } = req.body;
      const { result, count } = await studentServices.getAllResults(
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Exercise results fetched successfully.",
        data: result,
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
  }
};
