const { STUDENT } = require("../../constants/roles.constant");
const studentModel = require("./student.model");
const createError = require("http-errors");
const commonHelpers = require("../../helpers/common.helper");
const { sendMailWithServices } = require("../../helpers/mail.helper");
const { userServices } = require("..");
const mongoose = require("mongoose");
const assignAssessmentsModel = require("../assignAssessment/assignAssessment.model");
const studentsModel = require("./student.model");
const QuizModel = require("../quizzes/quizzes.model");

const getFilter = (filterObj, key) => {
  if (filterObj[key]) {
    return {
      [key]: {
        $in: filterObj[key].map((value) => new mongoose.Types.ObjectId(value))
      }
    };
  }
  return {};
};

module.exports = {
  createStudent: async (data) => {
    try {
      const student = await studentModel.create(data);
      // const password = commonHelpers.generateRandomPassword();

      // const userData = {
      //   email: data.email,
      //   password,
      //   user_name: data.name,
      //   permissions: [],
      //   role: STUDENT,
      // };
      // const createUser = await userServices.createUser(userData);
      // if (!createUser) {
      //   next(createError.InternalServerError("Error creating user."));
      // }
      // const to = data.email;
      // const subject = "Password for Learning management system";
      // const body = `Your Password for Learning management system is ${password}`;
      // sendMailWithServices(to, subject, body);

      if (!student) createError(500, "Error while creating student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  createStudentsInBulk: async (data) => {
    try {
      const student = await studentModel.insertMany(data);
      if (!student) throw createError(500, "Error while creating student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  getStudentById: async (id) => {
    try {
      const student = await studentModel.findOne({ _id: id });
      if (!student) createError(500, "Error while getting student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  updateStudent: async (id, data) => {
    try {
      const student = await studentModel.findOneAndUpdate({ _id: id }, data, {
        new: true
      });
      if (!student) createError(500, "Error while updating student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  deleteStudent: async (id) => {
    try {
      const student = await studentModel.findOneAndDelete({ _id: id });
      if (!student) createError(500, "Error while deleting student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  getAllStudents: async (search, pageNo, perPage) => {
    try {
      let filter = {};
      if (search) {
        filter = {
          $or: [
            { name: { $regex: search } },
            { email: { $regex: search } },
            { rollNo: { $regex: search } }
          ]
        };
      }

      const student = await studentModel
        .find(filter)
        .sort({ name: 1 })
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await studentModel.countDocuments();
      if (!student) {
        throw createError(404, "Students not found");
      }

      return { student, count };
    } catch (error) {
      throw error;
    }
  },
  statusChange: async (id) => {
    try {
      const student = await studentModel.findOne({ _id: id });
      if (!student) createError(400, "invalid student id.");
      student.active = !student.active;
      await student.save();
      return student;
    } catch (error) {
      throw createError(error);
    }
  },
  getBatchWiseStudents: async (filterData, search, perPage, pageNo) => {
    try {
      console.log("filterData", filterData);
      const filter = {
        $and: [
          filterData,
          {
            $or: [
              { name: { $regex: search } },
              { email: { $regex: search } },
              { rollNo: { $regex: search } },
              { phone: { $regex: search } },
              { section: { $regex: search } }
            ]
          }
        ]
      };
      const students = await studentModel
        .find(filter)
        .populate("collegeUserId", "_id collegeName collegeNo")
        .populate("batchId", "_id batchName batchNumber")
        .populate("department", "_id department")
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await studentModel.countDocuments(filter);

      return { students, count };
    } catch (error) {
      throw error;
    }
  },
  getCollegeWiseStudents: async (collegeId, search, perPage, pageNo) => {
    try {
      const filter = { collegeUserId: collegeId };
      if (search) {
        filter[$or] = [
          { name: { $regex: search } },
          { email: { $regex: search } }
        ];
      }
      const student = await studentModel
        .find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await studentModel.countDocuments(filter);
      if (!student) {
        throw createError(404, "Students not found");
      }
      return { student, count };
    } catch (error) {
      throw error;
    }
  },

  // ...

  getQuizDataOfAllStudents: async (filterObj, page, perPage) => {
    try {
      let filter = {
        ...getFilter(filterObj, "collegeId"),
        ...getFilter(filterObj, "batchId"),
        ...getFilter(filterObj, "assessmentId")
      };

      //get assessment ids based on all three filters
      if (filterObj?.quizId?.length > 0) {
        const quizAggResult = await QuizModel.aggregate([
          {
            $match: {
              _id: {
                $in: filterObj?.quizId.map(
                  (id) => new mongoose.Types.ObjectId(id)
                )
              }
            }
          },
          {
            $group: {
              _id: null,
              assessmentIds: { $push: "$assessmentId" }
            }
          }
        ]);
        console.log("quizAggResult", quizAggResult);
        console.log("assessmentIds", quizAggResult[0]?.assessmentIds?.length);

        if (quizAggResult[0]?.assessmentIds?.length > 0) {
          filter.assessmentId = {
            $in: quizAggResult[0].assessmentIds
          };
        }
      }

      let batchIds;

      console.log("filter", filter);

      //based on assessmentIds we fetch the batchIds
      if (filter.collegeId || filter.batchId || filter.assessmentId) {
        const batchAggResult = await assignAssessmentsModel.aggregate([
          {
            $match: filter
          },
          {
            $group: {
              _id: null,
              batchIds: { $addToSet: "$batchId" }
            }
          }
        ]);
        console.log("batchAggResult", batchAggResult);
        // if (batchAggResult?.length === 0)
        //   throw createError.NotFound("No students found.");
        batchIds = batchAggResult[0]?.batchIds;
      }

      const studentFilter = {};

      if (batchIds?.length > 0) {
        studentFilter.batchId = { $in: batchIds };
      }
      console.log("studentFilter", studentFilter);

      const quizData = await studentsModel.aggregate([
        { $match: studentFilter },
        {
          $lookup: {
            from: "trackingquizzes",
            let: { userId: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", "$$userId"] },
                      { $eq: ["$quizType", "quiz"] }
                    ]
                  }
                }
              },
              {
                $lookup: {
                  from: "quizzes",
                  let: { quizId: "$quizId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$quizId"]
                        }
                      }
                    },
                    {
                      $project: {
                        title: 1
                      }
                    }
                  ],
                  as: "quizData"
                }
              },
              {
                $project: {
                  _id: 1,
                  correctAnswers: 1,
                  wrongAnswers: 1,
                  totalMarks: 1,
                  totalTime: 1,
                  takenTime: 1,
                  title: {
                    $arrayElemAt: ["$quizData.title", 0]
                  }
                }
              }
            ],
            as: "quizData"
          }
        },
        {
          $unwind: {
            path: "$quizData",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            name: 1,
            rollNo: 1,
            section: 1,
            quizData: 1,
            quizStatus: { $cond: [{ $eq: ["$string", null] }, false, true] }
          }
        },
        {
          $facet: {
            paginatedData: [
              { $skip: (page - 1) * perPage },
              { $limit: perPage }
            ],
            totalCount: [{ $count: "count" }]
          }
        }
      ]);

      // Extract paginated data and total count
      const paginatedData = quizData[0]?.paginatedData || [];
      const totalCount = quizData[0]?.totalCount[0]?.count || 0;

      return { quizData: paginatedData, quizCount: totalCount };
    } catch (error) {
      throw error;
    }
  }
};
