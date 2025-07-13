const { courseServices } = require("../services");
const createError = require("http-errors");
const commonUploadFunction = require("../helpers/fileUpload.helper");
const { default: mongoose } = require("mongoose");

module.exports = {
  createCourse: async (req, res, next) => {
    try {
      const image = req.files?.image;
      console.log("image", image);
      const request_body = req.body;
      if (image) {
        const movetoAWS = await commonUploadFunction.uploadMaterialToAWS(
          image,
          `courses/coverImage/`
        );
        console.log("movetoAWS", movetoAWS);

        if (!movetoAWS.status)
          return res.json({
            status: false,
            message: movetoAWS.message,
            data: []
          });
        if (movetoAWS.data) request_body.coverImage = movetoAWS.data;
        console.log("movetoAWS", movetoAWS);
      }
      const course = await courseServices.createCourse(req.body);
      res.send({
        success: true,
        message: "Course created successfully",
        data: course
      });
    } catch (error) {
      next(error);
    }
  },
  getCourseById: async (req, res, next) => {
    try {
      const course = await courseServices.getCourseById(req.params.id);
      res.send({
        success: true,
        message: "Course fetched successfully",
        data: course
      });
    } catch (error) {
      next(error);
    }
  },
  statusToggle: async (req, res, next) => {
    try {
      const course = await courseServices.toggleCourseStatus(req.params.id);
      const message = course.active ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Course ${message} successfully`,
        data: course
      });
    } catch (error) {
      next(error);
    }
  },
  publishToggle: async (req, res, next) => {
    try {
      const course = await courseServices.toggleCoursePublishStatus(
        req.params.id
      );
      const message = course.isPublish ? "published" : "unpublished";
      res.status(200).json({
        success: true,
        message: `Course ${message} successfully`,
        data: course
      });
    } catch (error) {
      next(error);
    }
  },
  updateCourse: async (req, res, next) => {
    try {
      const image = req.files?.image;
      const request_body = req.body;
      if (image) {
        const movetoAWS = await commonUploadFunction.uploadMaterialToAWS(
          image,
          `courses/coverImage/`
        );
        if (!movetoAWS.status)
          return res.json({
            status: false,
            message: movetoAWS.message,
            data: []
          });
        if (movetoAWS.data) request_body.coverImage = movetoAWS.data;
      }
      const course = await courseServices.updateCourse(
        req.params.id,
        request_body
      );
      res.send({
        success: true,
        message: "Course updated successfully",
        data: course
      });
    } catch (error) {
      next(error);
    }
  },
  deleteCourse: async (req, res, next) => {
    try {
      const course = await courseServices.deleteCourse(req.params.id);
      res.send({
        success: true,
        message: "Course deleted successfully",
        data: course
      });
    } catch (error) {
      next(error);
    }
  },
  getCoursesByCollegeId: async (req, res, next) => {
    try {
      const { search, pageNo = 1, perPage = 10 } = req.body;
      const college_id = req?.body?.collegeId ? req.body?.collegeId : null;
      const activeFilter = req.body?.activeFilter;

      const userRole = res.locals.userRole;
      // userRole === "student" ? filter.isPublish = true : filter.
      const { courses, count } = await courseServices.getCoursesByCollegeId(
        college_id,
        activeFilter,
        search,
        pageNo,
        perPage
      );
      res.send({
        success: true,
        message: "Courses fetched successfully",
        data: courses,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  },
  getCoursesOptions: async (req, res, next) => {
    try {
      const collegeId = req.params.collegeId;
      const courses = await courseServices.getCourseOptions(collegeId);
      res.send({
        success: true,
        message: "Courses fetched successfully",
        data: courses
      });
    } catch (error) {
      next(error);
    }
  },
  addAssignCourse: async (req, res, next) => {
    try {
      const ids = req.body;
      const courses = await courseServices.addAssignCourse(
        ids.batchId,
        ids.collegeId,
        ids.courseId
      );
      if (courses) {
        return res.status(200).json({
          success: true,
          message: "Course assigned successfully",
          data: courses
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to assign course"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addAssignCourseCollege: async (req, res, next) => {
    try {
      const ids = req.body;
      const courses = await courseServices.addAssignCourseCollege(
        ids.collegeId,
        ids.courseId
      );
      if (courses) {
        return res.status(200).json({
          success: true,
          message: "Course assigned successfully",
          data: courses
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to assign course"
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getCourseSectionOptionsByCourseId: async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const options = await courseServices.getCourseSectionOptionsByCourseId(
        courseId
      );
      res.send({
        success: true,
        message: "Courses sections options fetched successfully",
        data: options
      });
    } catch (error) {
      next(error);
    }
  },
  getCourseSidebarDataById: async (req, res, next) => {
    try {
      const user_id = req.body?.user_id;
      const batchId = req.body?.batch_id;
      const courseId = req.params.courseId;
      const courseData = await courseServices.getCourseSidebarDataById(
        user_id,
        batchId,
        courseId
      );

      res.send({
        success: true,
        message: "Courses Data fetched successfully",
        data: courseData
      });
    } catch (error) {
      next(error);
    }
  },
  getCoursepreviewById: async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const courseData = await courseServices.getCoursepreviewById(courseId);
      res.send({
        success: true,
        message: "Courses Data fetched successfully",
        data: courseData
      });
    } catch (error) {
      next(error);
    }
  },
  getCourseCompletionReport: async (req, res, next) => {
    try {
      const {
        collegeId,
        batchId,
        departmentId,
        courseId,
        search,
        pageNo = 1,
        perPage = 10
      } = req.body;
      const college_id = req?.body?.college_id
        ? req?.body?.college_id
        : req.body?.collegeId
        ? req.body?.collegeId
        : null;
      const filter = {
        collegeId: college_id ? new mongoose.Types.ObjectId(college_id) : null,
        batchId: batchId ? new mongoose.Types.ObjectId(batchId) : null,
        departmentId: departmentId
          ? new mongoose.Types.ObjectId(departmentId)
          : null,
        courseId: courseId ? new mongoose.Types.ObjectId(courseId) : null,
        search: search ? search : null,
        pageNo: Number(pageNo),
        perPage: Number(perPage)
      };
      const { result, count } = await courseServices.getCourseCompletionReport(
        filter
      );
      res.send({
        success: true,
        message: "Courses fetched successfully",
        body: filter,
        data: result,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage)
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
