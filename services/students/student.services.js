const studentModel = require("./students.model");
const createError = require("http-errors");

module.exports = {
  createStudent: async (data) => {
    try {
      const student = await studentModel.create(data);
      if (!student) createError(500, "Error while creating student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  getStudentById: async (id) => {
    try {
      const student = await studentModel.findOne({ _id: id });
      if (!student) createError(500, "Error while getting student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  updateStudent: async (id, data) => {
    try {
      const student = await studentModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (!student) createError(500, "Error while updating student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  deleteStudent: async (id) => {
    try {
      const student = await studentModel.findOneAndDelete({ _id: id });
      if (!student) createError(500, "Error while deleting student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  getAllStudents: async (search, pageNo, perPage) => {
    try {
      let filter = {};
      if (search) {
        filter = {
          $or: [{ name: { $regex: search } }, { email: { $regex: search } }],
        };
      }

      const student = await studentModel
        .find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await studentModel.countDocuments();
      if (!student) {
        throw createError(404, "Students not found");
      }

      return { student, count };
    } catch (error) {
      throw error;
    }
  },
  statusChange: async (id) => {
    try {
      const student = await studentModel.findOne({ _id: id });
      if (!student) createError(400, "invalid student id.");
      student.active = !student.active;
      await student.save();
      return student;
    } catch (error) {
      throw createError(error);
    }
  },
  getBatchWiseStudents: async (batchId, search, perPage, pageNo) => {
    try {
      const filter = { batchId: batchId };
      if (search) {
        filter[$or] = [
          { name: { $regex: search } },
          { email: { $regex: search } },
        ];
      }
      console.log("filter", filter);
      const student = await studentModel
        .find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await studentModel.countDocuments(filter);
      if (!student) {
        throw createError(404, "Students not found");
      }
      return { student, count };
    } catch (error) {
      throw error;
    }
  },
  getCollegeWiseStudents: async (collegeId, search, perPage, pageNo) => {
    try {
      const filter = { collegeUserId: collegeId };
      if (search) {
        filter[$or] = [
          { name: { $regex: search } },
          { email: { $regex: search } },
        ];
      }
      console.log("filter", filter);
      const student = await studentModel
        .find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await studentModel.countDocuments(filter);
      if (!student) {
        throw createError(404, "Students not found");
      }
      return { student, count };
    } catch (error) {
      throw error;
    }
  },
};
