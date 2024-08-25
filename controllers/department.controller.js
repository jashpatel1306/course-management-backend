const departmentService = require("../services/departments/departments.services");

module.exports = {
  getDepartments: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const departments = await departmentService.getDepartments(userId);
      res.status(200).send({
        success: true,
        message: "departments fetched successfully",
        data: departments,
      });
    } catch (error) {
      next(error);
    }
  },

  createDepartment: async (req, res, next) => {
    try {
      const userId = req.body;
      const department = await departmentService.createDepartmentData(req.body);
      res.status(201).send({
        success: true,
        message: "department created successfully",
        data: department,
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
        req.params.id,
        req.body
      );
      res.status(200).send({
        success: true,
        message: "department updated successfully",
        data: department,
      });
    } catch (error) {
      next(error);
    }
  },
};
