const studentCertificateService = require("../services");
const createHttpError = require("http-errors");

module.exports = {
  createStudentCertificate: async (req, res, next) => {
    try {
      const certificate = await studentCertificateService.createStudentCertificate(
        req.body
      );
      return res.status(201).json({
        status: true,
        message: "Student certificate created successfully.",
        data: certificate
      });
    } catch (error) {
      next(error);
    }
  },

  getAllStudentCertificates: async (req, res, next) => {
    try {
      const certificates = await studentCertificateService.getAllStudentCertificates();
      return res.status(200).json({
        status: true,
        message: "Certificates fetched successfully.",
        data: certificates
      });
    } catch (error) {
      next(error);
    }
  },

  getStudentCertificateById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const certificate = await studentCertificateService.getStudentCertificateById(id);
      if (!certificate) throw createHttpError(404, "Certificate not found");

      return res.status(200).json({
        status: true,
        message: "Certificate fetched successfully.",
        data: certificate
      });
    } catch (error) {
      next(error);
    }
  },

  updateStudentCertificateStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const updated = await studentCertificateService.updateStudentCertificateStatus(
        id,
        status
      );
      return res.status(200).json({
        status: true,
        message: "Certificate status updated successfully.",
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  deleteStudentCertificate: async (req, res, next) => {
    try {
      const id = req.params.id;
      await studentCertificateService.deleteStudentCertificate(id);
      return res.status(200).json({
        status: true,
        message: "Certificate deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }
};
