const { departmentService } = require("../services");

module.exports = {
  getDepartments: async (req, res, next) => {
    try {
      const college_id = req?.params?.collegeId
        ? req.params?.collegeId === "all"
          ? req.body?.college_id
          : req.params?.collegeId
        : req.body?.college_id;
      const departments = await departmentService.getDepartments(college_id);
      res.status(200).send({
        success: true,
        message: "departments fetched successfully",
        data: departments
      });
    } catch (error) {
      next(error);
    }
  },
  getDepartmentsOptions: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const departments = await departmentService.getDepartmentsOptions(
        collegeId
      );
      res.status(200).send({
        success: true,
        message: "departments fetched successfully",
        data: departments
      });
    } catch (error) {
      next(error);
    }
  },

  createDepartment: async (req, res, next) => {
    try {
      const body = req.body;
      const department = await departmentService.createDepartmentData(body);
      res.status(201).send({
        success: true,
        message: "department created successfully",
        data: department
      });
    } catch (error) {
      next(error);
    }
  },

  updateDepartment: async (req, res, next) => {
    try {
      const id = req.params.id;
      const department = await departmentService.updateDepartmentData(
        id,
        req.body
      );
      res.status(200).send({
        success: true,
        message: "department updated successfully",
        data: department
      });
    } catch (error) {
      next(error);
    }
  },
  deleteDepartment: async (req, res, next) => {
    try {
      const id = req.params.id;
      const department = await departmentService.deleteDepartmentData(id);
      res.status(200).send({
        success: true,
        message: "department deleted successfully",
        data: department
      });
    } catch (error) {
      next(error);
    }
  }
};
