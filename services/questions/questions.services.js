const questionsModel = require("./questions.model");
const createError = require("http-errors");

module.exports = {
  createQuestion: async (data) => {
    try {
      const result = await questionsModel.create(data);
      if (!result) throw createError(500, "Error while creating question");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getQuestionById: async (id) => {
    try {
      const result = await questionsModel.findOne({ _id: id });
      if (!result) throw createError(400, "invalid question id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },
  getPublicQuestionById: async (id) => {
    try {
      const result = await questionsModel.findOne(
        { _id: id, active: true },
        {
          _id: 1,
          question: 1,
          marks: 1,
          quizId: 1,
          questionType: 1,
          answers: { content: 1, _id: 1 }
        }
      );
      if (!result) throw createError(400, "invalid question id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  getQuestionsByQuiz: async (filter, perPage, pageNo) => {
    try {
      const result = await questionsModel
        .find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      if (!result) throw createError(500, "Error while fetching questions");
      const count = await questionsModel.countDocuments(filter);
      return { result, count };
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  updateQuestion: async (id, data) => {
    try {
      const result = await questionsModel.findOneAndUpdate({ _id: id }, data, {
        new: true
      });
      if (!result) throw createError(400, "invalid question id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  deleteQuestion: async (id) => {
    try {
      const result = await questionsModel.findOneAndDelete({ _id: id });
      if (!result) throw createError(400, "invalid question id");
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  },

  activeToggle: async (id) => {
    try {
      const result = await questionsModel.findOne({ _id: id });
      if (!result) throw createError(400, "invalid question id");
      result.active = !result.active;
      await result.save();
      return result;
    } catch (error) {
      throw createError.InternalServerError(error);
    }
  }
};
