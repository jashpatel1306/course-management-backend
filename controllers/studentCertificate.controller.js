const { studentCertificateService } = require("../services");
const createHttpError = require("http-errors");

module.exports = {
  createStudentCertificate: async (req, res, next) => {
    try {
      const apiData = {
        userId: req.body.user_id,
        collegeId: req.body.college_id,
        batchId: req.body.batch_id,
        courseId: req.body.courseId,
        studentName: req.body.studentName,
        courseName: req.body.courseName
      };
      console.log("apiData: ", apiData);
      const certificate =
        await studentCertificateService.createStudentCertificate(apiData);
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
      const certificates =
        await studentCertificateService.getAllStudentCertificates();
      return res.status(200).json({
        status: true,
        message: "Certificates fetched successfully.",
        data: certificates
      });
    } catch (error) {
      next(error);
    }
  },
  getAllCertificates: async (req, res, next) => {
    try {
      const filter = {
        collegeId: req.body.collegeId ? req.body.collegeId : null,
        batchId: req.body.batchId ? req.body.batchId : null,
        courseId: req.body.courseId ? req.body.courseId : null,
        pageNo: Number(req.body.pageNo),
        perPage: Number(req.body.perPage)
      };
      const { result, count } =
        await studentCertificateService.getAllCertificates(filter);
      return res.status(200).json({
        status: true,
        message: "Certificates fetched successfully.",
        data: result,
        pagination: {
          total: count,
          perPage: Number(req.body.perPage),
          pageNo: Number(req.body.pageNo),
          pages: Math.ceil(count / Number(req.body.perPage))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getStudentCertificateById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const certificate =
        await studentCertificateService.getStudentCertificateById(id);
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
  //changesCertificatesResultVisibility
  changesCertificatesResultVisibility: async (req, res, next) => {
    try {
      // const { trackingId } = req.params;

      const { certificateStatus, certificateIds, collegeId } = req.body;
      await studentCertificateService.changesCertificateVisibility(
        certificateIds,
        collegeId,
        certificateStatus
      );
      return res.status(200).send({
        success: true,
        message: "Quiz result visibility changed successfully.",
        data: []
      });
    } catch (error) {
      next(error);
    }
  },
  updateStudentCertificateStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const updated =
        await studentCertificateService.updateStudentCertificateStatus(
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
  approveStudentCertificate: async (req, res, next) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const updated = await studentCertificateService.updateStudentCertificate(
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
