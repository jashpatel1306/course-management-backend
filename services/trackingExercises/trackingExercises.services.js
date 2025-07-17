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
  createEnrollExercise: async (body, exerciseId, assessmentId, totalMarks) => {
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
        totalMarks,
        ...body
      };

      const result = await trackingExercisesModel.create(data);
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  updateResultTrackingExercise: async (_id, data) => {
    try {
      const trackingExercise = await trackingExercisesModel.findOneAndUpdate(
        { _id },
        {
          showResult: true,
          result: data.result,
          isSubmit: true,
          totalAssignMarks: data.totalAssignMarks
        }
      );

      if (!trackingExercise)
        throw createError(400, "Invalid tracking exercise ID");
      return trackingExercise;
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
    isSubmit = false,
    showResult = false,
    assignMasks = 0
  ) => {
    try {
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
      console.log("existingEntry ", trackingId, exerciseId, existingEntry);
      const result = await trackingExercisesModel.findOneAndUpdate(
        { _id: trackingId, exerciseId },
        {
          $set: {
            isSubmit: isSubmit,
            showResult: showResult,
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
  },
  getAllResult: async (filter, perPage, pageNo) => {
    try {
      const firstCond = { isSubmit: true };
      const secondeCond = {};

      if (filter?.exerciseId) {
        firstCond.exerciseId = {
          $eq: new ObjectId(filter.exerciseId)
        };
      }
      if (filter?.collegeId) {
        secondeCond.collegeId = {
          $eq: new ObjectId(filter.collegeId)
        };
      }
      if (filter?.batchId) {
        secondeCond.batchId = {
          $eq: new ObjectId(filter.batchId)
        };
      }
      if (filter?.userId) {
        secondeCond.userId = {
          $eq: new ObjectId(filter.userId)
        };
      }
      if (filter?.assessmentId) {
        secondeCond.assessmentId = {
          $eq: new ObjectId(filter.assessmentId)
        };
      }
      const pipeline = [
        {
          $match: {
            ...firstCond
          }
        },
        {
          $project: {
            trackingId: "$_id",
            userId: "$userId",
            exerciseId: "$exerciseId",
            totalAssignMarks: "$totalAssignMarks",
            totalMarks: "$totalMarks",
            isSubmit: "$isSubmit",
            showResult: "$showResult"
          }
        },
        {
          $lookup: {
            from: "students",
            let: { userId: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$userId", "$$userId"] }
                }
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  batchId: 1,
                  collegeUserId: 1,
                  rollNo: 1,
                  phone: 1,
                  email: 1 // Include the answers for lookup
                }
              }
            ],
            as: "userData"
          }
        },
        {
          $lookup: {
            from: "exercises",
            let: { exerciseId: "$exerciseId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$exerciseId"] }
                }
              },
              {
                $project: {
                  _id: 1,
                  totalMarks: 1,
                  title: 1,
                  assessmentId: 1,
                  questionsLength: { $size: "$questions" }
                }
              }
            ],
            as: "exerciseData"
          }
        },
        {
          $project: {
            trackingId: "$trackingId",
            userId: "$userId",
            exerciseId: "$exerciseId",
            totalAssignMarks: "$totalAssignMarks",
            totalMarks: "$totalMarks",
            assessmentId: "$assessmentId",
            userName: { $arrayElemAt: ["$userData.name", 0] },
            userEmail: { $arrayElemAt: ["$userData.email", 0] },
            userRollNo: { $arrayElemAt: ["$userData.rollNo", 0] },
            userPhone: { $arrayElemAt: ["$userData.phone", 0] },
            collegeId: { $arrayElemAt: ["$userData.collegeUserId", 0] },
            batchId: { $arrayElemAt: ["$userData.batchId", 0] },
            exerciseTitle: { $arrayElemAt: ["$exerciseData.title", 0] },
            exerciseTotalMarks: {
              $arrayElemAt: ["$exerciseData.totalMarks", 0]
            },
            exerciseTime: { $arrayElemAt: ["$exerciseData.time", 0] },
            assessmentId: { $arrayElemAt: ["$exerciseData.assessmentId", 0] },
            exerciseQuestionsLength: {
              $arrayElemAt: ["$exerciseData.questionsLength", 0]
            },
            showResult: "$showResult"
          }
        },
        {
          $match: { ...secondeCond }
        }
      ];
      const result = await trackingExercisesModel.aggregate([
        ...pipeline,
        { $skip: (pageNo - 1) * perPage },
        { $limit: perPage }
      ]);
      const countResult = await trackingExercisesModel.aggregate([...pipeline]);

      if (!result) throw createError(500, "Error while Fetching result.");

      return { result, count: countResult.length };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  changesResultVisibility: async (trackingIds, showResult) => {
    try {
      let result;
      if (trackingIds.length > 0) {
        result = await trackingExercisesModel.updateMany(
          { _id: { $in: trackingIds } },
          { showResult: showResult }
        );
      } else {
        result = await trackingExercisesModel.updateMany(
          {},
          { showResult: showResult }
        );
      }

      if (!result) throw createError(500, "Error while Fetching result.");

      return { result };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getExerciseResultId: async (id) => {
    try {
      const result = await trackingExercisesModel.findOne(
        {
          _id: id
        },
        { result: 0 }
      );
      if (!result) throw createError(400, "Invalid quiz tracking id.");
      return result;
    } catch (error) {
      throw error;
    }
  }
};
