const { staffServices } = require("../services");
const { userServices } = require("../services");
const { Validate } = require("../validation/validation.methods");

module.exports = {
  createStaff: async (req, res, next) => {
    try {
      const staff = await staffServices.createStaff(req.body);

      res.send({
        success: true,
        message: "Staff member created successfully",
        data: staff
      });
    } catch (error) {
      next(error);
    }
  },

  createBulkStaff: async (req, res, next) => {
    try {
      const batchId = req.body?.batchId;
      const collegeId = req.body?.collegeId || req.body?.college_id;
      const staffData = req.body?.excelData;

      Validate();
      const staffList = await Promise.all(
        staffData.map(async (staffMember) => {
          staffMember.batchId = batchId;
          staffMember.collegeUserId = collegeId;

          const insertedStaff = await staffServices.createStaff(staffMember);
          return insertedStaff;
        })
      );

      res.send({
        success: true,
        message: "Staff members created successfully",
        data: staffList
      });
    } catch (error) {
      next(error);
    }
  },

  getStaffById: async (req, res, next) => {
    try {
      const staff = await staffServices.getStaffById(req.params.id);
      res.send({
        success: true,
        message: "Staff member fetched successfully",
        data: staff
      });
    } catch (error) {
      next(error);
    }
  },

  getAllStaff: async (req, res, next) => {
    try {
      const staff = await staffServices.getAllStaff(
        req.body?.search,
        req.body?.pageNo,
        req.body?.perPage
      );
      res.send({
        success: true,
        message: "Staff members fetched successfully",
        data: staff
      });
    } catch (error) {
      next(error);
    }
  },

  updateStaff: async (req, res, next) => {
    try {
      const staff = await staffServices.updateStaff(req.params.id, req.body);
      await userServices.updatePermission(staff.userId, req.body.permissions);      //Changes By Fenil for permission update issue
      res.send({
        success: true,
        message: "Staff member updated successfully",
        data: staff
      });
    } catch (error) {
      next(error);
    }
  },

  deleteStaff: async (req, res, next) => {
    try {
      const staff = await staffServices.deleteStaff(req.params.id);
      res.send({
        success: true,
        message: "Staff member deleted successfully",
        data: staff
      });
    } catch (error) {
      next(error);
    }
  },

  activeStatusChange: async (req, res, next) => {
    try {
      const id = req.params.id;
      const staff = await staffServices.statusChange(id);
      const message = staff.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Staff member ${message} successfully`,
        data: staff
      });
    } catch (error) {
      next(error);
    }
  },

  getBatchWiseStaff: async (req, res, next) => {
    try {
      const batchId = req.body?.batchId;
      const perPage = req.body?.perPage;
      const pageNo = req.body?.pageNo;
      const search = req.body?.search;
      const collegeId = req.body?.collegeId || req.body?.college_id;

      const searchText = new RegExp(search, `i`);
      const { staff, count } = await staffServices.getBatchWiseStaff(
        batchId === "all" ? "" : batchId,
        searchText,
        perPage,
        pageNo,
        collegeId
      );

      res.send({
        success: true,
        message: "Staff members fetched successfully",
        data: staff,
        pagination: {
          total: count,
          perPage: perPage,
          pageNo: pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getCollegeWiseStaff: async (req, res, next) => {
    try {
      const perPage = req.body?.perPage;
      const pageNo = req.body?.pageNo;
      const search = req.body?.search;
      const college_id = req?.body?.collegeId
        ? req.body?.collegeId === "all"
          ? req.body?.college_id
          : req.body?.collegeId
        : req.body?.college_id;
      const searchText = new RegExp(search, `i`);

      const { staff, count } = await staffServices.getCollegeWiseStaff(
        searchText,
        perPage,
        pageNo,
        college_id
      );
      res.send({
        success: true,
        message: "Staff members fetched successfully",
        data: staff,
        pagination: {
          total: count,
          perPage: perPage,
          pageNo: pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
