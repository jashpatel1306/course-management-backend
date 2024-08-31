const studentServices = require("../services/students/student.services");
const createError = require("http-errors");
const excelHelper = require("../helpers/excel.helper");
const batchesServices = require("../services/batches/batches.services");
const collegeServices = require("../services/colleges/colleges.service");
const departmentsServices = require("../services/departments/departments.services");
module.exports = {
  createStudent: async (req, res, next) => {
    try {
      const student = await studentServices.createStudent(req.body);
      res.send({
        success: true,
        message: "student created successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  createBulkStudents: async (req, res, next) => {
    try {
      const batchId = req.body.batchId;
      const collegeId = req.body.collegeId || req.body.college_id;
      const studentsData = req.body.excelData;

      // Use Promise.all to resolve all promises in the array
      const studentData = await Promise.all(
        studentsData.map(async (student) => {
          student.batchId = batchId;
          student.collegeUserId = collegeId;
          const departmentData = await departmentsServices.getDepartmentsbyName(collegeId,student.department)
          console.log("departmentData :",departmentData._id)
          student.department = departmentData?._id;
          const insertedStudent = await studentServices.createStudent(student);
          return insertedStudent;
        })
      );

      res.send({
        success: true,
        message: "students created successfully",
        data: studentData,
      });
    } catch (error) {
      next(error);
    }
  },
  getStudentById: async (req, res, next) => {
    try {
      const student = await studentServices.getStudentById(req.params.id);
      res.send({
        success: true,
        message: "student fetched successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllStudents: async (req, res, next) => {
    try {
      const students = await studentServices.getAllStudents(
        req.body.search,
        req.body.pageNo,
        req.body.perPage
      );
      res.send({
        success: true,
        message: "students fetched successfully",
        data: students,
      });
    } catch (error) {
      next(error);
    }
  },

  updateStudent: async (req, res, next) => {
    try {
      const student = await studentServices.updateStudent(
        req.params.id,
        req.body
      );
      res.send({
        success: true,
        message: "student updated successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteStudent: async (req, res, next) => {
    try {
      const student = await studentServices.deleteStudent(req.params.id);
      res.send({
        success: true,
        message: "student deleted successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  activeStatusChange: async (req, res, next) => {
    try {
      const id = req.params.id;
      const student = await studentServices.statusChange(id);
      const message = student.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `student ${message} successfully`,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllStudentsBatchWise: async (req, res, next) => {
    try {
      const batchId = req.body.batchId;
      const perPage = req.body.perPage;
      const pageNo = req.body.pageNo;
      const search = req.body.search;
      const college_id =
        req.body.collegeId === "all" ? req.body.college_id : req.body.collegeId;
      const searchText = new RegExp(search, `i`);

      const { students, count } = await studentServices.getBatchWiseStudents(
        batchId === "all" ? "" : batchId,
        searchText,
        perPage,
        pageNo,
        college_id
      );
      res.send({
        success: true,
        message: "students fetched successfully",
        data: students,
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
  getCollegeWiseStudents: async (req, res, next) => {
    try {
      const collegeId = req.body.collegeId;
      const students = await studentServices.getCollegeWiseStudents(
        collegeId,
        req.body.search,
        req.body.perPage,
        req.body.pageNo
      );
      res.send({
        success: true,
        message: "students fetched successfully",
        data: students,
      });
    } catch (error) {
      next(error);
    }
  },
};
