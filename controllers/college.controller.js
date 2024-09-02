const { ADMIN } = require("../constants/roles.constant");
const createError = require("http-errors");
const { collegeServices } = require("../services");

module.exports = {
  createCollege: async (req, res, next) => {
    try {
      const data = req.body;
      data.role = ADMIN;
      const college = await collegeServices.createCollege(data);
      res.status(201).json({
        success: true,
        message: "college created successfully.",
        data: college,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllColleges: async (req, res, next) => {
    try {
      const perPage = req.body.perPage;
      const pageNo = req.body.pageNo;
      const search = req.body.search;
      const searchText = new RegExp(search, `i`);
      const status = req.params.status;
      const { college, count } = await collegeServices.getAllColleges(
        searchText,
        pageNo,
        perPage,
        status
      );
      res.status(200).json({
        success: true,
        message: "Colleges fetched successfully",
        data: college,
        pagination: {
          total: count,
          perPage: perPage,
          pageNo: pageNo,
          pages: Math.ceil(count / perPage),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getCollegeById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const college = await collegeServices.getOneCollegeById(id);
      res.status(200).json({
        success: true,
        message: "college fetched successfully",
        data: college,
      });
    } catch (error) {
      next(error);
    }
  },

  changeActiveStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const college = await collegeServices.activeStatusChange(id);
      const message = college.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `college ${message} successfully`,
        data: college,
      });
    } catch (error) {
      next(error);
    }
  },
  inactivateCollege: async (req, res, next) => {
    try {
      const id = req.params.id;
      const college = await collegeServices.activeStatusChange(id);
      res.status(200).json({
        success: true,
        message: "college inactivated successfully",
        data: college,
      });
    } catch (error) {
      next(error);
    }
  },
  getCollegesOption: async (req, res, next) => {
    try {
      const college = await collegeServices.getKeyValueColleges();
      res.status(200).send({
        success: true,
        message: "college fetched successfully",
        data: college,
      });
    } catch (error) {
      next(error);
    }
  },
};
