const createError = require("http-errors");
const dashboardServices = require("../services/dashboard.services");
const { bulkStudentSchema } = require("../validation/validation.schemas");
const { STUDENT } = require("../constants/roles.constant");

module.exports = {
  getDashboardCountsData: async (req, res, next) => {
    try {
      const userId = req?.body?.user_id;
      const collegeId = req?.body?.college_id;
      const role = res.locals.userRole;
      let filter = {};

      if (role === STUDENT) {
        filter.courseFilter = {
          collegeId,
        };
        filter.batchFilter = {
          collegeId,
        };
      }

      const data = await dashboardServices.countDocsFromMultipleCollections();

      res
        .status(200)
        .json({ success: true, message: "dashboard data fetched.", data });
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
