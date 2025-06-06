const departmentModel = require("./departments.model");
const createError = require("http-errors");

module.exports = {
  getDepartments: async (collegeId) => {
    try {
      const filter = {};
      if (collegeId) {
        filter.collegeId = collegeId;
      }
      console.log("filter : ",filter)
      const departments = await departmentModel.find(filter);

      return departments;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  getDepartmentsbyName: async (collegeId, departmentName) => {
    try {
      const departments = await departmentModel.findOne({
        collegeId,
        $expr: {
          $eq: [
            { $toLower: { $trim: { input: "$department" } } },
            departmentName.trim().toLowerCase()
          ]
        }
      });
      console.log("departments: ", collegeId, departmentName, departments);
      if (!departments)
        throw createError.BadRequest(
          `department '${departmentName}' does not exist for this college.`
        );
      return departments;
    } catch (error) {
      throw error;
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
  deleteDepartmentData: async (id) => {
    try {
      const department = await departmentModel.findOneAndDelete({ _id: id });
      if (!department) createError(500, "Error while deleting department");
      return department;
    } catch (error) {
      throw error;
    }
  }
};
