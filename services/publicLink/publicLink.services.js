const QuizModel = require("../quizzes/quizzes.model");
const publicLinkModel = require("./publicLink.model");
const createError = require("http-errors");
async function getMultipleQuizDetailsSimple(quizIds) {
  const quizzes = await QuizModel.find({ _id: { $in: quizIds } }).select(
    "title questions time totalMarks"
  );

  return quizzes.map((quiz) => ({
    quizId: quiz._id,
    totalQuestions: quiz.questions.length, // Count of questions
    questionIds: quiz.questions, // Array of question IDs
    totalTime: quiz.time, // Quiz total time
    totalMarks: quiz.totalMarks, // Quiz total time
    title: quiz.title,
  }));
}
async function mergeQuizDetails(quizIds) {
  const quizzes = await getMultipleQuizDetailsSimple(quizIds); // Assume this fetches the details
  // Merge all values into one object
  let quizArr = [];
  const mergedDetails = quizzes.reduce(
    (acc, quiz) => {
      acc.totalQuestions += quiz.totalQuestions;
      acc.questionIds = acc.questionIds.concat(quiz.questionIds); // Merge question IDs
      acc.totalTime += quiz.totalTime;
      acc.totalMarks += quiz.totalMarks;
      quizArr.push({title:quiz.title, totalMarks:quiz.totalMarks, totalQuestion:quiz.totalQuestions });
      return acc;
    },
    { totalQuestions: 0, questionIds: [], totalTime: 0, totalMarks: 0 } // Initial values
  );
  mergedDetails.details= quizArr
  return mergedDetails;
}
module.exports = {
  createPublicLink: async (data) => {
    try {
      const publicLink = await publicLinkModel.create(data);
      if (!publicLink)
        throw createError(500, "Error while creating publicLink");
      return publicLink;
    } catch (error) {
      throw createError(error);
    }
  },

  getPublicLinkById: async (id) => {
    try {
      const publicLink = await publicLinkModel.findOne({ _id: id });
      if (!publicLink)
        throw createError(500, "Error while retrieving publicLink");
      return publicLink;
    } catch (error) {
      throw createError(error);
    }
  },
  increaseHitCount: async (id) => {
    try {
      const publicLink = await publicLinkModel.findOneAndUpdate(
        { _id: id },
        { $inc: { hits: 1 } },
        { new: true }
      );
      if (!publicLink) throw createError(400, "Invalid publicLink ID");

      // await publicLink.increaseHits();
      console.log("Hit count increased successfully");
    } catch (error) {
      throw createError(error);
    }
  },

  getPublicLinkByQuizData: async (id) => {
    try {
      const publicLink = await publicLinkModel.findOne(
        { _id: id },
        { createdAt: 0, updatedAt: 0, active: 0 }
      );
      if (!publicLink)
        throw createError(500, "Error while retrieving publicLink");
      const quizdetails = await mergeQuizDetails(publicLink.quizId);
      const result = {
        ...publicLink.toObject(),
        soltStatus: publicLink.hits >= publicLink.noofHits ? false : true,

        quizdetails,
      };
      delete result.hits;
      delete result.noofHits;
      return result;
    } catch (error) {
      throw createError(error);
    }
  },
  updatePublicLink: async (id, data) => {
    try {
      const publicLink = await publicLinkModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true,
        }
      );
      if (!publicLink)
        throw createError(500, "Error while updating publicLink");
      return publicLink;
    } catch (error) {
      throw createError(error);
    }
  },

  deletePublicLink: async (id) => {
    try {
      const publicLink = await publicLinkModel.findOneAndDelete({ _id: id });
      if (!publicLink)
        throw createError(500, "Error while deleting publicLink");
      return publicLink;
    } catch (error) {
      throw createError(error);
    }
  },

  getAllPublicLink: async (search, pageNo, perPage, status) => {
    try {
      let filter = {};

      if (status === "upcoming") {
        filter = {
          startDate: { $gte: new Date() },
        };
      } else if (status === "active") {
        filter = {
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() },
        };
      } else if (status === "expired") {
        filter = {
          endDate: { $lt: new Date() },
        };
      }
      const publicLink = await publicLinkModel
        .find(filter)
        // .sort({ name: 1 })
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      // .populate("quizId", "_id title");
      const count = await publicLinkModel.countDocuments(filter);
      if (!publicLink) throw createError(404, "PublicLink not found");

      return { publicLink, count };
    } catch (error) {
      throw createError(error);
    }
  },

  statusChange: async (id) => {
    try {
      const publicLink = await publicLinkModel.findOne({ _id: id });
      if (!publicLink) throw createError(400, "Invalid publicLink ID");
      publicLink.active = !publicLink.active;
      await publicLink.save();
      return publicLink;
    } catch (error) {
      throw createError(error);
    }
  },
};
