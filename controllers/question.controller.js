const createError = require("http-errors");
const mongoose = require("mongoose");
const { questionServices, quizzesServices } = require("../services");
const transformData = async (quizId, data) => {
  return await data.map((item) => {
    const answers = [];
    let i = 1;
    while (item[`answer${i}`]) {
      answers.push({
        content: `<p>${item[`answer${i}`]}</p>`,
        reason: `${
          item.correctAnswer === item[`answer${i}`]
            ? item.answerExplanation || ""
            : ""
        }`,
        correct: item.correctAnswer === item[`answer${i}`]
      });
      i++;
    }

    return {
      quizId: quizId,
      question: `<p>${item.question}</p>`,
      questionType: item.type,
      marks: item.mark,
      answers
    };
  });
};
module.exports = {
  createQuestion: async (req, res, next) => {
    try {
      const reqData = req.body;
      const question = await questionServices.createQuestion(reqData);
      return res.status(201).send({
        success: true,
        message: "Question created successfully.",
        data: question
      });
    } catch (error) {
      next(error);
    }
  },
  createBulkQuestion: async (req, res, next) => {
    try {
      const questionData = req.body;
      const questionObject = await transformData(
        questionData.quizId,
        questionData.excelData
      );
      const result = await questionServices.createQuestionsInBulk(
        questionObject
      );
      res.send({
        success: true,
        message: "students created successfully",
        data: questionObject
      });
    } catch (error) {
      next(error);
    }
  },
  updateQuestion: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const reqData = req.body;
      const question = await questionServices.updateQuestion(
        questionId,
        reqData
      );
      return res.status(200).send({
        success: true,
        message: "Question updated successfully",
        data: question
      });
    } catch (error) {
      next(error);
    }
  },
  getQuestionById: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const question = await questionServices.getQuestionById(questionId);
      return res.status(200).send({
        success: true,
        message: "Question fetched successfully",
        data: question
      });
    } catch (error) {
      next(error);
    }
  },
  getPublicQuestionById: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const question = await questionServices.getPublicQuestionById(questionId);
      return res.status(200).send({
        success: true,
        message: "Question fetched successfully",
        data: question
      });
    } catch (error) {
      next(error);
    }
  },

  deleteQuestion: async (req, res, next) => {
    try {
      const questionId = req.params.id;
      const question = await questionServices.deleteQuestion(questionId);
      return res.status(200).send({
        success: true,
        message: "Question deleted successfully",
        data: []
      });
    } catch (error) {
      next(error);
    }
  },

  changeActiveStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const question = await questionServices.activeToggle(id);
      const message = question.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `Question ${message} successfully`,
        data: question
      });
    } catch (error) {
      next(error);
    }
  },

  getQuestionsByQuiz: async (req, res, next) => {
    try {
      const { pageNo, perPage, status } = req.body;
      const quizId = req.params.quizId;
      const filter = {
        quizId: { $eq: new mongoose.Types.ObjectId(quizId) }
      };
      const quizData = await quizzesServices.getQuizById(quizId);
      if (status === "active") {
        filter.active = true;
      } else if (status === "inactive") {
        filter.active = false;
      }
      const { result, count } = await questionServices.getQuestionsByQuiz(
        filter,
        perPage,
        pageNo
      );
      return res.status(200).send({
        success: true,
        message: "Questions fetched successfullys",
        data: quizData.questions,
        quizData: quizData.questions,
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
