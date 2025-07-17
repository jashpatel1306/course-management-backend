const AssessmentsModel = require("./assessments.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { toggleActive } = require("../quizzes/quizzes.services");
const trackingCourseModel = require("../trackingCourse/trackingCourse.model");
const trackingQuizzeseModel = require("../trackingQuiz/trackingQuiz.model");
const trackingExercisesModel = require("../trackingExercises/trackingExercises.model");
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

  getAssessmentById: async (id, userId) => {
    try {
      const assessment = await AssessmentsModel.aggregate([
        { $match: { _id: new ObjectId(id) } },
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
                  _id: 1,
                  totalMarks: 1,
                  title: 1,
                  time: 1,
                  assessmentId: 1,
                  description: 1,
                  active: 1,
                  questionsLength: { $size: "$questions" },
                  isPublish: 1
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: "exercises", // Collection name for exercises
            localField: "contents.id",
            foreignField: "_id",
            as: "exerciseData"
          }
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
                              cond: { $eq: ["$$quiz._id", "$$content.id"] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    {
                      type: "$$content.type",
                      data: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$exerciseData",
                              as: "exercise",
                              cond: { $eq: ["$$exercise._id", "$$content.id"] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },

        {
          $project: {
            title: 1,
            type: 1,
            totalMarks: 1,
            totalQuestions: 1,
            expiresAt: 1,
            quizTrackingData: 1,
            content: {
              $filter: {
                input: "$contents",
                as: "content",
                cond: { $eq: ["$$content.data.active", true] }
              }
            }
          }
        } // Remove lookup arrays from the result
      ]);

      if (!assessment || assessment.length === 0)
        throw createError(404, "Assessment not found");
      let finalData = assessment[0];
      if (assessment[0].type === "quiz") {
        finalData.trackingQuizData = await trackingQuizzeseModel.find(
          {
            userId: userId,
            assessmentId: id
          },
          {
            _id: 1,
            userId: 1,
            quizId: 1,
            quizType: 1
          }
        );
      }
      if (assessment[0].type === "exercise") {
        finalData.trackingExerciseData = await trackingExercisesModel.find(
          {
            userId: userId,
            assessmentId: id
          },
          {
            _id: 1,
            userId: 1,
            exerciseId: 1,
            isSubmit: 1,
            showResult: 1
          }
        );
      }

      return finalData; // Since aggregate returns an array
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
          new: true
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

  getAssessmentsByBatch: async (
    search,
    perPage,
    pageNo,
    batchId,
    collegeId,
    type
  ) => {
    try {
      const filter = {
        $and: [
          type ? { type } : {},
          batchId !== "all"
            ? {
                batches: { $in: [batchId] }
              }
            : {},
          collegeId ? { collegeId } : {},
          {
            $or: [{ title: { $regex: search } }]
          }
        ]
      };

      const assessments = await AssessmentsModel.find(filter)
        .populate("batches", "_id batchName")
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await AssessmentsModel.countDocuments(filter);

      if (!assessments)
        throw createError(500, "Error while fetching assessments.");

      return { assessments, count };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getAssessmentsByStudentId: async (filter, perPage, pageNo) => {
    try {
      // const filter = {
      //   $and: [
      //     collegeId ? { collegeId } : {},
      //     batchId ? { batches: { $in: [new ObjectId(batchId)] } } : {}, // Convert batchId to ObjectId
      //     {
      //       $or: [{ title: { $regex: search, $options: "i" } }], // Added 'i' for case-insensitive search
      //     },
      //   ],
      // };

      const assessments = await AssessmentsModel.find(filter)
        .populate("batches", "_id batchName")
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await AssessmentsModel.countDocuments(filter);

      if (!assessments)
        throw createError(500, "Error while fetching assessments.");

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
  getAssessmentOptionsByCollegeId: async (collegeId) => {
    try {
      const assessment = await AssessmentsModel.find({
        collegeId: collegeId
      });
      const data = assessment.map((item) => {
        return { label: item.title, value: item._id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  addBatch: async (assessmentId, batchId) => {
    try {
      const updatedAssessment = await AssessmentsModel.addBatchToAssessment(
        assessmentId,
        batchId
      );
    } catch (error) {
      console.error("Error adding batch:", error.message);
    }
  }
};
