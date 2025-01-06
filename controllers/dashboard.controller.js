const createError = require("http-errors");
const dashboardServices = require("../services/dashboard.services");
const { bulkStudentSchema } = require("../validation/validation.schemas");
const { STUDENT } = require("../constants/roles.constant");

module.exports = {
  getAdminDashboardData: async (req, res, next) => {
    try {
      console.log("getAdminDashboardData");
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
        colleges,
        courses,
        studentRegistrationChart,
        activeStudentsChart,
      ] = await Promise.all([
        dashboardServices.countDocsFromMultipleCollections({}),
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

  getAdminDashBoard: async (req, res, next) => {
    try {
      const filter = {};
      const countData =
        await dashboardServices.countDocsFromMultipleCollections(filter);
    } catch (err) {
      next(err);
    }
  },
};
