const departmentModel = require("./departments.model");
const createError = require("http-errors");

module.exports = {
  getDepartments: async (userId) => {
    try {
      const departments = await departmentModel.find({ userId });
      const array = departments[0].departments;
      const data = array.map((department) => {
        return { key: department, value: department };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  createDepartmentData: async (data) => {
    try {
      const department = await departmentModel.create(data);
      if (!department) createError(500, "Error while creating department");
      return department;
    } catch (error) {
      throw error;
    }
  },

  updateDepartmentData: async (id, data) => {
    try {
      const department = await departmentModel.findOneAndUpdate(
        { _id: id },
        data
      );
      if (!department) createError(500, "Error while updating department");
      return department;
    } catch (error) {
      throw error;
    }
  },
};
