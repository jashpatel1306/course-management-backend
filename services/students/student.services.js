const { STUDENT } = require("../../constants/roles.constant");
const studentModel = require("./students.model");
const createError = require("http-errors");
const commonHelpers = require("../../helpers/common.helper");
const { sendMailWithServices } = require("../../helpers/mail.helper");
const { userServices } = require("..");

module.exports = {
  createStudent: async (data) => {
    try {
      
      const student = await studentModel.create(data);
      // const password = commonHelpers.generateRandomPassword();

      // const userData = {
      //   email: data.email,
      //   password,
      //   user_name: data.name,
      //   permissions: [],
      //   role: STUDENT,
      // };
      // const createUser = await userServices.createUser(userData);
      // if (!createUser) {
      //   next(createError.InternalServerError("Error creating user."));
      // }
      // const to = data.email;
      // const subject = "Password for Learning management system";
      // const body = `Your Password for Learning management system is ${password}`;
      // sendMailWithServices(to, subject, body);

      if (!student) createError(500, "Error while creating student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  createStudentsInBulk: async (data) => {
    try {
      const student = await studentModel.insertMany(data);
      if (!student) throw createError(500, "Error while creating student");
      return student;
    } catch (error) {
      throw createError(error);
    }
  },

  preStudentCreate: async (data) => {
    return data;
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
          $or: [
            { name: { $regex: search } },
            { email: { $regex: search } },
            { rollNo: { $regex: search } },
          ],
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
      const filter = {
        $and: [
          { batchId },
          {
            $or: [
              { name: { $regex: search } },
              { email: { $regex: search } },
              { rollNo: { $regex: search } },
            ],
          },
        ],
      };
      const students = await studentModel
        .find(filter)
        .populate("collegeUserId", "_id collegeName collegeNo")
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await studentModel.countDocuments(filter);
      // if (students.length) {
      //   throw createError(404, "Students not found");
      // }
      return { students, count };
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
