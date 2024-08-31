const departmentModel = require("./departments.model");
const createError = require("http-errors");

module.exports = {
  getDepartments: async (collegeId) => {
    try {
      const departments = await departmentModel.find({ collegeId });

      return departments;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  getDepartmentsbyName: async (collegeId, departmentName) => {
    try {
      const departments = await departmentModel.findOne({
        collegeId,
        department: new RegExp(`^${departmentName}$`, "i"),
      });

      return departments;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  getDepartmentsOptions: async (collegeId) => {
    try {
      const departments = await departmentModel.find({ collegeId });
      const data = departments.map((item) => {
        return { label: item.department, value: item._id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  createDepartmentData: async (data) => {
    try {
      console.log("data: ", data);
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
