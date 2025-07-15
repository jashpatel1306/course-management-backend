const ExercisesModel = require("./exercises.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

module.exports = {
  createExercise: async (data) => {
    try {
      let exercise;
      if (data.exerciseId) {
        exercise = await ExercisesModel.findOneAndUpdate(
          { _id: data.exerciseId },
          data,
          { new: true }
        );
      } else {
        exercise = await ExercisesModel.create(data);
      }

      if (!exercise) throw createError(500, "Error while creating exercise");
      return exercise;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getExerciseById: async (id) => {
    try {
      const exercise = await ExercisesModel.findById(id)
        .populate({
          path: "questions",
          match: { active: true }
        })
        .exec();

      if (!exercise) throw new Error("Exercise not found");

      return exercise.toObject();
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getStudentExerciseById: async (id) => {
    try {
      const exercise = await ExercisesModel.findById(id);

      if (!exercise) throw new Error("Exercise not found");

      return exercise.toObject();
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getExerciseByAssessmentId: async (assessmentId) => {
    try {
      const exercises = await ExercisesModel.find(
        { assessmentId, active: true },
        { _id: 1, title: 1 }
      );

      if (!exercises) throw new Error("Assessment ID not found");

      return exercises;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getExerciseQuestionsById: async (id) => {
    try {
      const exercise = await ExercisesModel.findById(id)
        .populate({
          path: "exercisquestions",
          match: { active: true }
        })
        .exec();

      if (!exercise) throw new Error("Exercise not found");

      return exercise;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  updateExercise: async (id, data) => {
    try {
      const exercise = await ExercisesModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true
        }
      );

      if (!exercise) throw createError(400, "Invalid exercise ID");

      return exercise;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getExercisesByAssessment: async (filter, perPage, pageNo) => {
    try {
      const exercises = await ExercisesModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      if (!exercises) throw createError(500, "Error while fetching exercises");

      const count = await ExercisesModel.countDocuments(filter);

      return { exercises, count };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getExerciseOptions: async (filter) => {
    try {
      const exercises = await ExercisesModel.find(filter);
      const data = exercises.map((item) => ({
        label: item.title,
        value: item._id,
        time: item.time
      }));
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },

  toggleActiveStatus: async (id, active) => {
    try {
      const exercise = await ExercisesModel.findOne({ _id: id });

      if (!exercise) throw createError(400, "Invalid exercise ID");

      exercise.active = !exercise.active;
      exercise.isPublish = active;
      await exercise.save();
      return exercise;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  }
};
