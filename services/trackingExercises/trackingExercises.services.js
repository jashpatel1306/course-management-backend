const mongoose = require("mongoose");
const createError = require("http-errors");
const trackingExercisesModel = require("./trackingExercises.model");
const exerciseQuestionModel = require("../exercisQuestions/exercisQuestions.model");
const { ObjectId } = mongoose.Types;

const upsertExerciseQuestion = (data, newRecord) => {
  const existingIndex = data.findIndex((entry) =>
    entry.questionId.equals(new ObjectId(newRecord.questionId))
  );
  if (existingIndex !== -1) {
    data[existingIndex] = { ...data[existingIndex], ...newRecord };
  } else {
    data.push({ ...newRecord, _id: new ObjectId() });
  }
  return data;
};

module.exports = {
  createEnrollExercise: async (body, exerciseId, assessmentId) => {
    try {
      const userId = body?.user_id || new ObjectId();
      const exists = await trackingExercisesModel.findOne({
        userId,
        exerciseId
      });
      if (exists)
        throw createError(400, "You have already taken this exercise.");

      const data = {
        userId,
        exerciseId,
        assessmentId,
        ...body
      };

      const result = await trackingExercisesModel.create(data);
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getExerciseTrackingById: async (userId, exerciseId) => {
    try {
      const result = await trackingExercisesModel
        .findOne({ userId, exerciseId })
        .populate("result.questionId");
      if (!result) throw createError(400, "Tracking record not found.");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  updateExerciseTracking: async (
    trackingId,
    exerciseId,
    questionId,
    answer,
    assignMasks,
    time
  ) => {
    try {
      const questionResult = await exerciseQuestionModel.findOne({
        _id: new ObjectId(questionId)
      });
      const pushData = {
        result: {
          questionId,
          answer,
          assignMasks: assignMasks || 0
        }
      };

      const existingEntry = await trackingExercisesModel.findOne({
        _id: trackingId,
        exerciseId
      });
      const result = await trackingExercisesModel.findOneAndUpdate(
        { _id: trackingId, exerciseId },
        {
          $set: {
            totalTime: time,
            result: upsertExerciseQuestion(
              existingEntry.result,
              pushData.result
            )
          }
        },
        { new: true }
      );

      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  submitExercise: async (userId, exerciseId, resultData) => {
    try {
      const tracking = await trackingExercisesModel.findOneAndUpdate(
        { userId, exerciseId },
        { $set: { result: resultData, isSubmit: true } },
        { new: true }
      );
      if (!tracking) throw createError(400, "Exercise tracking not found");
      return tracking;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  deleteExerciseTracking: async (id) => {
    try {
      const result = await trackingExercisesModel.findOneAndDelete({ _id: id });
      if (!result) throw createError(400, "Tracking not found");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getExerciseId: async (id) => {
    try {
      const result = await trackingExercisesModel.findById(id);
      if (!result) throw createError(400, "Invalid tracking id");
      return result.exerciseId;
    } catch (error) {
      throw error;
    }
  }
};
