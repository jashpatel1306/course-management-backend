const AssessmentsModel = require("./assessments.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const { toggleActive } = require("../quizzes/quizzes.services");
module.exports = {
  createAssessment: async (data) => {
    try {
      const assessment = await AssessmentsModel.create(data);
      if (!assessment)
        throw createError(500, "Error while creating assessment");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  // getAssessmentById: async (id) => {
  //   try {
  //     const assessment = await AssessmentsModel.findOne({ _id: id });
  //     if (!assessment) throw createError(400, "invalid assessment id");
  //     return assessment;
  //   } catch (error) {
  //     throw createError.InternalServerError(error);
  //   }
  // },

  getAssessmentById: async (id) => {
    try {
      const assessment = await AssessmentsModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "quizzes", // Collection name for quizzes
            localField: "contents.id",
            foreignField: "_id",
            as: "quizData",
            pipeline: [
              { $match: { active: true } },
              {
                $project: {
                  title: 1,
                  _id: 1,
                  description: 1,
                  totalMarks: 1,
                  questions: 1,
                  active: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "exercises", // Collection name for exercises
            localField: "contents.id",
            foreignField: "_id",
            as: "exerciseData",
          },
        },
        {
          $addFields: {
            contents: {
              $map: {
                input: "$contents",
                as: "content",
                in: {
                  $cond: [
                    { $eq: ["$$content.type", "quiz"] },
                    {
                      type: "$$content.type",
                      data: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$quizData",
                              as: "quiz",
                              cond: { $eq: ["$$quiz._id", "$$content.id"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    {
                      type: "$$content.type",
                      data: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$exerciseData",
                              as: "exercise",
                              cond: { $eq: ["$$exercise._id", "$$content.id"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },

        {
          $project: {
            title: 1,
            expiresAt: 1,
            content: {
              $filter: {
                input: "$contents",
                as: "content",
                cond: { $eq: ["$$content.data.active", true] },
              },
            },
          },
        }, // Remove lookup arrays from the result
      ]);

      if (!assessment || assessment.length === 0)
        throw createError(404, "Assessment not found");

      return assessment[0]; // Since aggregate returns an array
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  updateAssessment: async (id, data) => {
    try {
      const assessment = await AssessmentsModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true,
        }
      );
      if (!assessment) throw createError(400, "invalid assessment id");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  deleteAssessment: async (id) => {
    try {
      const assessment = await AssessmentsModel.findOneAndDelete({ _id: id });
      if (!assessment) throw createError(400, "invalid assessment id");
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getAssessmentsByBatch: async (filter, perPage, pageNo) => {
    try {
      // {
      //   batchIds: { $elemMatch: { $eq: batchId } },
      // }

      const assessments = await AssessmentsModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await AssessmentsModel.countDocuments(filter);
      if (!assessments)
        throw createError(500, "Error while Fetching assessments.");
      return { assessments, count };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  toggleActiveStatus: async (id) => {
    try {
      const assessment = await AssessmentsModel.findOne({ _id: id });
      if (!assessment) {
        throw createError(400, "Invalid assessment id");
      }

      assessment.active = !assessment.active;
      await assessment.save();
      return assessment;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
};
