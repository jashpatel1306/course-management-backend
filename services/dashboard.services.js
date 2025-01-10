const instructorModel = require("../services/instructor/instructor.model");
const studentModel = require("../services/students/student.model");
const courseModel = require("../services/courses/course");
const collegeModel = require("../services/colleges/colleges.model");
const batchModel = require("../services/batches/batches.model");
const { Batch } = require("aws-sdk");
const { Types } = require("mongoose");
const { ObjectId } = Types;
const moment = require("moment");
const userSessionsModel = require("../services/userSessions/userSessions.model");
const { id } = require("../validation/validation");
const userModel = require("./users/user.model");
const batchesModel = require("../services/batches/batches.model");

const generateMonthRange = (start, end) => {
  const months = [];
  const startMoment = moment(start);
  const endMoment = moment(end);

  while (startMoment.isSameOrBefore(endMoment, "month")) {
    months.push({
      month: startMoment.month() + 1, // Months in moment are 0-based
      name: startMoment.format("MMMM"),
    });
    startMoment.add(1, "month");
  }
  return months;
};

module.exports = {
  countDocsFromMultipleCollections: async (collegeId) => {
    try {
      const filter = {};
      const userFilter = {};

      if (collegeId) {
        filter["collegeId"] = collegeId;
        userFilter["collegeUserId"] = collegeId;
      }

      console.log("filter", filter);
      console.log("userFilter", userFilter);
      const [instructors, students, courses, colleges, batches] =
        await Promise.all([
          instructorModel.countDocuments(filter),
          studentModel.countDocuments(userFilter),
          courseModel.countDocuments(filter),
          collegeModel.countDocuments({}),
          batchModel.countDocuments(filter),
        ]);
      console.log("instructor");
      return {
        instructors,
        students,
        batches,
        colleges,
        courses,
      };
    } catch (error) {
      throw error;
    }
  },

  getStudentRegistrationData: async (filterObj) => {
    try {
      const filter = [];

      // Default startDate and endDate if not provided
      const currentYear = moment().year();
      const defaultStartDate = moment().startOf("year").toDate(); // First day of the current year
      const defaultEndDate = moment().endOf("day").toDate(); // Current day

      const startDate = filterObj.startDate
        ? new Date(filterObj.startDate)
        : defaultStartDate;
      const endDate = filterObj.endDate
        ? new Date(filterObj.endDate)
        : defaultEndDate;

      // Add filters dynamically
      filter.push({ $gte: ["$createdAt", startDate] });
      filter.push({ $lte: ["$createdAt", endDate] });

      if (filterObj.year) {
        filter.push({ $eq: [{ $year: "$createdAt" }, filterObj.year] });
      }

      if (filterObj.collegeId) {
        filter.push({
          $eq: ["$collegeUserId", new ObjectId(filterObj.collegeId)],
        });
      }

      // Generate dynamic month range
      const dynamicMonths = generateMonthRange(startDate, endDate);
      console.log("dynamicMonths", dynamicMonths);
      // MongoDB Aggregation Pipeline
      const result = await studentModel.aggregate([
        {
          $match: {
            $expr: {
              $and: filter,
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            months: {
              $push: {
                month: "$_id.month",
                count: "$count",
              },
            },
          },
        },
        {
          $addFields: {
            dynamicMonths: dynamicMonths,
          },
        },
        {
          $project: {
            _id: 0,
            monthsArray: {
              $map: {
                input: "$dynamicMonths",
                as: "monthInfo",
                in: "$$monthInfo.name",
              },
            },
            valuesArray: {
              $map: {
                input: "$dynamicMonths",
                as: "monthInfo",
                in: {
                  $let: {
                    vars: {
                      existingMonth: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$months",
                              as: "m",
                              cond: { $eq: ["$$m.month", "$$monthInfo.month"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$existingMonth.count", 0] },
                  },
                },
              },
            },
          },
        },
        { $sort: { year: 1 } },
      ]);

      return result;
    } catch (error) {
      console.error("Error in getStudentRegistrationData:", error);
      throw error;
    }
  },

  getTopColleges: async () => {
    try {
      const result = await collegeModel.aggregate([
        {
          $lookup: {
            from: "students",
            let: { collegeId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$collegeUserId", "$$collegeId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "students",
          },
        },
        {
          $lookup: {
            from: "instructors",
            let: { collegeId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$collegeId", "$$collegeId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "instructors",
          },
        },

        {
          $project: {
            collegeName: 1,
            _id: 1,
            studentCount: { $size: "$students" },
            instructorsCount: { $size: "$instructors" },
          },
        },
        {
          $sort: {
            studentCount: -1,
            instructorCount: -1,
          },
        },
        {
          $limit: 5,
        },
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getTopCourses: async (filter) => {
    try {
      let pipeline = [];
      if (filter.collegeId) {
        pipeline.push({
          $match: { collegeId: new ObjectId(filter.collegeId) },
        });
      }

      pipeline.push(
        {
          $unwind: {
            path: "$courses",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "students",
            let: { batchId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$batchId", "$$batchId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "students",
          },
        },
        {
          $project: {
            courses: 1,

            students: { $size: "$students" },
          },
        },
        {
          $group: {
            _id: "$courses",
            students: { $sum: "$students" },
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "result",
            pipeline: [
              {
                $project: {
                  courseName: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            students: 1,
            course: {
              $arrayElemAt: ["$result.courseName", 0],
            },
            _id: 1,
          },
        },
        {
          $limit: 5,
        }
      );
      const result = await batchModel.aggregate(pipeline);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getTopBatches: async (collegeId) => {
    try {
      const pipeline = [];
      let filter = {};

      if (collegeId) {
        filter["collegeId"] = { $eq: new ObjectId(collegeId) };
        pipeline.push({ $match: filter });
      }

      pipeline.push(
        {
          $lookup: {
            from: "students",
            let: { batchId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$batchId", "$$batchId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "students",
          },
        },
        {
          $project: {
            batchName: 1,
            students: { $size: "$students" },
            _id: 1,
          },
        },
        {
          $sort: {
            students: -1,
          },
        },
        {
          $limit: 5,
        }
      );

      const result = await batchModel.aggregate(pipeline);

      return result;
    } catch (error) {
      throw error;
    }
  },

  getActiveStudents: async (filterObj) => {
    try {
      const filter = [];
      const currentYear = new Date().getFullYear();
      console.log("currentYear: ", currentYear);
      const startDate = filterObj.startDate
        ? new Date(filterObj.startDate)
        : new Date(currentYear, 0, 1); // Default to Jan 1 of the current year
      const endDate = filterObj.endDate
        ? new Date(filterObj.endDate)
        : new Date(currentYear, 11, 31); // Default to Dec 31 of the current year

      // Generate dynamic month range
      filterObj.collegeId
        ? filter.push({
            $eq: ["$collegeId", new ObjectId(filterObj.collegeId)],
          })
        : null;

      const dynamicMonths = generateMonthRange(startDate, endDate);
      console.log("dynamicMonths: ", dynamicMonths);
      // Apply role filter
      filter.push({ $eq: ["$role", "student"] });

      // Apply startDate and endDate filters
      filter.push({ $gte: ["$createdAt", startDate] });
      filter.push({ $lte: ["$createdAt", endDate] });

      const result = await userSessionsModel.aggregate([
        {
          $match: {
            $expr: { $and: filter },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            months: {
              $push: {
                month: "$_id.month",
                count: "$count",
              },
            },
          },
        },
        {
          $addFields: {
            allMonths: dynamicMonths,
          },
        },
        {
          $project: {
            _id: 0,
            monthsArray: {
              $map: {
                input: "$allMonths",
                as: "monthInfo",
                in: "$$monthInfo.name",
              },
            },
            valuesArray: {
              $map: {
                input: "$allMonths",
                as: "monthInfo",
                in: {
                  $let: {
                    vars: {
                      existingMonth: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$months",
                              as: "m",
                              cond: { $eq: ["$$m.month", "$$monthInfo.month"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$existingMonth.count", 0] },
                  },
                },
              },
            },
          },
        },

        { $sort: { year: 1 } },
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  },

  getInstructorDashboardData: async (instructorId) => {
    try {
      const instructor = await instructorModel.findOne(
        { userId: instructorId },
        { password: 0 }
      );
      console.log("instructor", instructor._id);
      const result = await batchesModel.aggregate([
        {
          $match: {
            instructorIds: { $eq: instructor._id },
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "batchId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "students",
          },
        },
        {
          $project: {
            batchName: 1,
            students: { $size: "$students" },
          },
        },
        {
          $group: {
            _id: null,
            batches: {
              $push: "$batchName",
            },
            students: {
              $push: "$students",
            },
            batchData: {
              $push: "$$ROOT",
            },
          },
        },
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  },
};
