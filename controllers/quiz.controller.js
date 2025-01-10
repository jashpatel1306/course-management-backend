const createError = require("http-errors");
const mongoose = require("mongoose");
const {
  quizzesServices,
  publicLinkServices,
  trackingQuizServices,
} = require("../services");
module.exports = {
  createQuiz: async (req, res, next) => {
    try {
      const quiz = await quizzesServices.createQuiz(req.body);
      return res.status(201).send({
        success: true,
        message: "Quiz created successfully.",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  createPublicQuiz: async (req, res, next) => {
    try {
      const req_body = { ...req.body, isPublic: true };

      const quiz = await quizzesServices.createQuiz(req_body);
      return res.status(201).send({
        success: true,
        message: "Quiz created successfully.",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  updateQuiz: async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const reqData = req.body;
      const quiz = await quizzesServices.updateQuiz(quizId, reqData);
      return res.status(200).send({
        success: true,
        message: "Quiz updated successfully",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  getQuizById: async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const quiz = await quizzesServices.getQuizById(quizId);
      return res.status(200).send({
        success: true,
        message: "Quiz fetched successfully",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  getStudentQuizById: async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const quiz = await quizzesServices.getStudentQuizById(quizId);
      return res.status(200).send({
        success: true,
        message: "Student Quiz fetched successfully",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  getPublicQuizById: async (req, res, next) => {
    try {
      const publicQuizId = req.params.id;
      const quiz = await publicLinkServices.getPublicLinkByQuizData(
        publicQuizId
      );
      return res.status(200).send({
        success: true,
        message: "public Quiz fetched successfully",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  getPublicQuizLogin: async (req, res, next) => {
    try {
      const { publicQuizId, password } = req.body;
      const quiz = await publicLinkServices.getPublicQuizLogin(
        publicQuizId,
        password
      );
      return res.status(200).send({
        success: true,
        message: "public Quiz login successfully",
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteQuiz: async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const quiz = await quizzesServices.toggleActiveStatus(quizId);
      return res.status(200).send({
        success: true,
        message: "Quiz deleted successfully",
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },
  changeActiveStatusQuiz: async (req, res, next) => {
    try {
      const id = req.params.id;
      const quiz = await quizzesServices.toggleActiveStatus(id, false);
      const message = quiz.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Quiz ${message} successfully`,
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  },
  getQuizzesByAssessment: async (req, res, next) => {
    try {
      const { pageNo, perPage, status } = req.body;
      const assessmentId = req.params.assessmentId;
      const filter = {
        assessmentId: { $eq: new mongoose.Types.ObjectId(assessmentId) },
      };

      if (status === "active") {
        filter.active = true;
      } else if (status === "inactive") {
        filter.active = false;
      }
      const { quizzes, count } = await quizzesServices.getQuizzesByAssessment(
        filter,
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Quizzes fetched successfully",
        data: quizzes,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage),
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getPublicQuizzes: async (req, res, next) => {
    try {
      const { pageNo, perPage, search, status } = req.body;
      const assessmentId = null;
      let filter = {
        assessmentId: null,
      };
      const searchText = new RegExp(search, `i`);

      if (status === "published") {
        filter.isPublish = true;
      } else if (status === "unpublished") {
        filter.isPublish = false;
      }

      if (search) {
        filter.title = { $regex: searchText };
      }
      const { quizzes, count } = await quizzesServices.getQuizzesByAssessment(
        filter,
        perPage,
        pageNo,
        searchText
      );
      return res.status(200).send({
        success: true,
        message: "Quizzes fetched successfully",
        data: quizzes,
        pagination: {
          total: count,
          perPage,
          pageNo,
          pages: Math.ceil(count / perPage),
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getPublicQuizzesOptions: async (req, res, next) => {
    try {
      const assessmentId = null;
      const filter = {
        assessmentId: null,
        isPublish: true,
        isPublic: true,
      };

      const quizzes = await quizzesServices.getQuizzesOptions(filter);
      return res.status(200).send({
        success: true,
        message: "Quizzes options fetched successfully",
        data: quizzes,
      });
    } catch (error) {
      next(error);
    }
  },

  getQuizTrackingResults: async (req, res, next) => {
    try {
      const { trackingId } = req.params;
      const quizId = await trackingQuizServices.getQuizId(trackingId);
      console.log("Quiz tracking", quizId);
      const result = await quizzesServices.getQuizResult(quizId, trackingId);
      return res.status(200).send({
        success: true,
        message: "Quiz tracking results fetched successfully",
        data: result ? result[0] : {},
      });
    } catch (error) {
      next(error);
    }
  },
};
