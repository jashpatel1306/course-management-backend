const { publicLinkServices } = require("../services");

module.exports = {
  createPublicLink: async (req, res, next) => {
    try {
      const publicLink = await publicLinkServices.createPublicLink(req.body);
      res.send({
        success: true,
        message: "PublicLink  created successfully",
        data: publicLink,
      });
    } catch (error) {
      next(error);
    }
  },

  getPublicLinkById: async (req, res, next) => {
    try {
      const publicLink = await publicLinkServices.getPublicLinkById(
        req.params.id
      );
      res.send({
        success: true,
        message: "PublicLink fetched successfully",
        data: publicLink,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPublicLink: async (req, res, next) => {
    try {
      const perPage = req.body?.perPage;
      const pageNo = req.body?.pageNo;
      const search = req.body?.search;
      const status = req.body?.status;

      const { publicLink, count } = await publicLinkServices.getAllPublicLink(
        search,
        pageNo,
        perPage,
        status
      );
      res.send({
        success: true,
        message: "PublicLinks fetched successfully",
        data: publicLink,
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

  updatePublicLink: async (req, res, next) => {
    try {
      const publicLink = await publicLinkServices.updatePublicLink(
        req.params.id,
        req.body
      );
      res.send({
        success: true,
        message: "PublicLink  updated successfully",
        data: publicLink,
      });
    } catch (error) {
      next(error);
    }
  },

  deletePublicLink: async (req, res, next) => {
    try {
      const publicLink = await publicLinkServices.deletePublicLink(
        req.params.id
      );
      res.send({
        success: true,
        message: "PublicLink  deleted successfully",
        data: publicLink,
      });
    } catch (error) {
      next(error);
    }
  },

  activeStatusChange: async (req, res, next) => {
    try {
      const id = req.params.id;
      const publicLink = await publicLinkServices.statusChange(id);
      const message = publicLink.active === true ? "activated" : "inactivated";
      res.status(200).json({
        success: true,
        message: `PublicLink  ${message} successfully`,
        data: publicLink,
      });
    } catch (error) {
      next(error);
    }
  },
};
