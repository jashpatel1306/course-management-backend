const ExercisesModel = require("../exercises/exercises.model");
const exerciseQuestionModel = require("../exercisQuestions/exercisQuestions.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

module.exports = {
  createExerciseQuestion: async (data) => {
    try {
      const result = await exerciseQuestionModel.create(data);
      if (!result)
        throw createError(500, "Error while creating exercise question");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getExerciseQuestionById: async (id) => {
    try {
      const result = await exerciseQuestionModel.findOne({ _id: id });
      if (!result) throw createError(400, "Invalid exercise question ID");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getQuestionsByExercise: async (filter, perPage, pageNo) => {
    try {
      const result = await exerciseQuestionModel
        .find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      if (!result)
        throw createError(500, "Error while fetching exercise questions");

      const count = await exerciseQuestionModel.countDocuments(filter);
      return { result, count };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  updateExerciseQuestion: async (id, data) => {
    try {
      const result = await exerciseQuestionModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true
        }
      );
      if (!result) throw createError(400, "Invalid exercise question ID");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  deleteExerciseQuestion: async (id) => {
    try {
      const result = await exerciseQuestionModel.findOneAndDelete({ _id: id });
      if (!result) throw createError(400, "Invalid exercise question ID");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  deleteExerciseQuestions: async (questionIds) => {
    try {
      const result = await exerciseQuestionModel.deleteMany({
        _id: { $in: questionIds }
      });
      if (!result) throw createError(400, "Invalid exercise question IDs");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  activeToggle: async (id) => {
    try {
      const result = await exerciseQuestionModel.findOne({ _id: id });
      if (!result) throw createError(400, "Invalid exercise question ID");

      result.active = !result.active;
      await result.save();

      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  }
};
