const createError = require("http-errors");
const dashboardServices = require("../services/dashboard.services");
const { bulkStudentSchema } = require("../validation/validation.schemas");
const { STUDENT } = require("../constants/roles.constant");
const { getInstructorsByCollegeId } = require("./instructors.controller");
const createHttpError = require("http-errors");

module.exports = {
  getAdminDashboardData: async (req, res, next) => {
    try {
      console.log("req.body: ", req.body);
      const startDateFilter = req.body.startDateFilter;
      const endDateFilter = req.body.endDateFilter;
      console.log("getAdminDashboardData", startDateFilter);
      console.log("getAdminDashboardData", endDateFilter);

      const filter = {};

      if (startDateFilter) {
        filter.startDate = new Date(startDateFilter);
      }

      if (endDateFilter) {
        filter.endDate = new Date(endDateFilter);
      }

      const [
        countData,
        colleges,
        courses,
        studentRegistrationChart,
        activeStudentsChart,
      ] = await Promise.all([
        dashboardServices.countDocsFromMultipleCollections(),
        dashboardServices.getTopColleges(),
        dashboardServices.getTopCourses({}),
        dashboardServices.getStudentRegistrationData(filter),
        dashboardServices.getActiveStudents(filter),
      ]);

      console.log("result data", countData, colleges, courses);

      return res.status(200).json({
        success: true,
        message: "dashboard data fetched.",
        data: {
          countData,
          colleges,
          courses,
          studentRegistrationChart,
          activeStudentsChart,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getCollegeDashBoardContent: async (req, res, next) => {
    try {
      const collegeId = req.body.college_id;
      if (!collegeId) throw createHttpError.BadRequest("Invalid collegeId");
      console.log("get college AdminDashboardData");
      const startDateFilter = req.body.startDateFilter;
      const endDateFilter = req.body.endDateFilter;

      const filter = {};

      if (startDateFilter) {
        filter.startDate = startDateFilter;
      }

      if (endDateFilter) {
        filter.endDate = endDateFilter;
      }
      const [
        countData,
        courses,
        batches,
        studentRegistrationChart,
        activeStudentsChart,
      ] = await Promise.all([
        dashboardServices.countDocsFromMultipleCollections(collegeId),
        dashboardServices.getTopCourses({ collegeId: collegeId }),
        dashboardServices.getTopBatches(collegeId),
        dashboardServices.getStudentRegistrationData({ ...filter, collegeId }),
        dashboardServices.getActiveStudents({ ...filter, collegeId }),
      ]);

      console.log("result data", countData, batches, courses);

      return res.status(200).json({
        success: true,
        message: "dashboard data fetched.",
        data: {
          countData,
          batches,
          courses,
          studentRegistrationChart,
          activeStudentsChart,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getDashboardDataOfInstructor: async (req, res, next) => {
    try {
      const instructorId = req.body.user_id;
      if (!instructorId)
        throw createHttpError.BadRequest("Invalid instructorId");
      const data = await dashboardServices.getInstructorDashboardData(
        instructorId
      );
      return res.status(200).json({
        success: true,
        message: "dashboard data fetched.",
        data,
      });
    } catch (err) {
      next(err);
    }
  },
  
};
