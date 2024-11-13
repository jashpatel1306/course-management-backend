const publicLinkModel = require("./publicLink.model");
const createError = require("http-errors");

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

  updatePublicLink: async (id, data) => {
    try {
      const publicLink = await publicLinkModel.findOneAndUpdate(
        { _id: id },
        data,
        {
          new: true
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

  getAllPublicLink: async (search, pageNo, perPage) => {
    try {
      let filter = {};

      const publicLink = await publicLinkModel
        .find(filter)
        .sort({ name: 1 })
        .skip((pageNo - 1) * perPage)
        .limit(perPage)
        .populate("quizId", "_id title");
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
  }
};
