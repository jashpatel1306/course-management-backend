const { studentServices, departmentService } = require("../services");

module.exports = {
  createStudent: async (req, res, next) => {
    try {
      const student = await studentServices.createStudent(req.body);
      res.send({
        success: true,
        message: "student created successfully",
        data: student
      });
    } catch (error) {
      next(error);
    }
  },

  createBulkStudents: async (req, res, next) => {
    try {
      const batchId = req.body?.batchId;
      const collegeId = req.body?.collegeId || req.body?.college_id;
      const studentsData = req.body?.excelData;
      // Use Promise.all to resolve all promises in the array
      const studentData = await Promise.all(
        studentsData.map(async (student) => {
          student.batchId = batchId;
          student.collegeUserId = collegeId;
          const departmentData = await departmentService.getDepartmentsbyName(
            collegeId,
            student?.department
          );
          student.department = departmentData?._id;
          const insertedStudent = await studentServices.createStudent(student);
          return insertedStudent;
        })
      );

      res.send({
        success: true,
        message: "students created successfully",
        data: studentData
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
        data: student
      });
    } catch (error) {
      next(error);
    }
  },

  getAllStudents: async (req, res, next) => {
    try {
      const students = await studentServices.getAllStudents(
        req.body?.search,
        req.body?.pageNo,
        req.body?.perPage
      );
      res.send({
        success: true,
        message: "students fetched successfully",
        data: students
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
        data: student
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
        data: student
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
        data: student
      });
    } catch (error) {
      next(error);
    }
  },
  getAllStudentsBatchWise: async (req, res, next) => {
    try {
      console.log("req.body :", req.body);
      const batchId = req.body?.batchId;
      const perPage = req.body?.perPage;
      const pageNo = req.body?.pageNo;
      const search = req.body?.search;
      const college_id = req?.body?.collegeId
        ? req.body?.collegeId === "all"
          ? req.body?.college_id
          : req.body?.collegeId
        : req.body?.college_id;

      const departmentId = req.body?.departmentId;
      const active = req.body?.active;
      const semester = req.body?.semester;
      const passoutYear = req.body?.passoutYear;

      let filter = {};

      batchId !== "all" ? (filter.batchId = batchId) : null;
      college_id !== "all"
        ? college_id && (filter.collegeUserId = college_id)
        : null;
      departmentId ? (filter.department = departmentId) : null;
      semester ? (filter.semester = semester) : null;
      active
        ? active === "active"
          ? (filter.active = true)
          : (filter.active = false)
        : null;
      passoutYear ? (filter.passoutYear = passoutYear) : null;

      const searchText = new RegExp(search, `i`);

      const { students, count } = await studentServices.getBatchWiseStudents(
        filter,
        searchText,
        perPage,
        pageNo
      );
      res.send({
        success: true,
        message: "students fetched successfully",
        data: students,
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
  getCollegeWiseStudents: async (req, res, next) => {
    try {
      const collegeId = req.body?.collegeId;
      const students = await studentServices.getCollegeWiseStudents(
        collegeId,
        req.body?.search,
        req.body?.perPage,
        req.body?.pageNo
      );
      res.send({
        success: true,
        message: "students fetched successfully",
        data: students
      });
    } catch (error) {
      next(error);
    }
  },

  getStudentQuizData: async (req, res, next) => {
    try {
      const filter = {};
      const reqBody = req.body;

      reqBody?.collegeId?.length > 0
        ? (filter.collegeId = reqBody?.collegeId)
        : null;

      reqBody?.batchId?.length > 0 ? (filter.batchId = reqBody?.batchId) : null;

      reqBody?.assessmentId?.length > 0
        ? (filter.assessmentId = reqBody?.assessmentId)
        : null;

      reqBody?.quizId?.length > 0 ? (filter.quizId = reqBody?.quizId) : null;

      console.log("filter", filter);
      const { quizCount, quizData } =
        await studentServices.getQuizDataOfAllStudents(
          filter,
          reqBody?.pageNo || 1,
          reqBody?.perPage || 10
        );
      return res.send({
        success: true,
        message: "student quiz data fetched successfully",
        data: {
          quizData,
          perPage: reqBody?.perPage || 10,
          pageNo: reqBody?.pageNo || 1,
          totalQuizCount: quizCount,
          pages: Math.ceil(quizCount / (reqBody?.perPage || 10))
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
