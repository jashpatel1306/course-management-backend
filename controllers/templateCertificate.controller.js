const createHttpError = require("http-errors");
const { templateCertificateService } = require("../services");

module.exports = {
  createCertificate: async (req, res, next) => {
    try {
      console.log("college_id : ", req.body.college_id);
      req.body.collegeId = req.body.college_id;
      const certificate =
        await templateCertificateService.createTemplateCertificate(req.body);
      return res.status(201).json({
        status: true,
        message: "Template certificate created successfully.",
        data: certificate
      });
    } catch (error) {
      next(error);
    }
  },

  getAllCertificates: async (req, res, next) => {
    try {
      const templates =
        await templateCertificateService.getAllTemplateCertificates();
      return res.status(200).json({
        status: true,
        message: "Templates fetched successfully.",
        data: templates
      });
    } catch (error) {
      next(error);
    }
  },

  getCertificateById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const template =
        await templateCertificateService.getTemplateCertificateById(id);
      if (!template) throw createHttpError(404, "Template not found");

      return res.status(200).json({
        status: true,
        message: "Template fetched successfully.",
        data: template
      });
    } catch (error) {
      next(error);
    }
  },

  updateCertificate: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updated =
        await templateCertificateService.updateTemplateCertificate(
          id,
          req.body
        );
      return res.status(200).json({
        status: true,
        message: "Template updated successfully.",
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  deleteCertificate: async (req, res, next) => {
    try {
      const id = req.params.id;
      await templateCertificateService.deleteTemplateCertificate(id);
      return res.status(200).json({
        status: true,
        message: "Template deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }
};
