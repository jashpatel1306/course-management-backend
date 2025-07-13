const studentCertificateModel = require("./studentCertificate.model");
const templateCertificateModel = require("../templateCertificate/templateCertificate.model");

module.exports = {
  createStudentCertificate: async (data) => {
    const template = await templateCertificateModel.findOne({
      type: "DEFAULT"
    });
    if (!template) throw new Error("Default certificate template not found");

    const fullData = {
      ...data,
      companyLogo1: template.companyLogo1,
      companyLogo2: template.companyLogo2,
      signature1: template.signature1,
      signatory1Name: template.signatory1Name,
      signatory1Title: template.signatory1Title,
      signature2: template.signature2,
      signatory2Name: template.signatory2Name,
      signatory2Title: template.signatory2Title
    };

    return await studentCertificateModel.create(fullData);
  },

  getAllStudentCertificates: async () => {
    return await studentCertificateModel
      .find()
      .populate("userId")
      .populate("courseId");
  },

  getStudentCertificateById: async (id) => {
    return await studentCertificateModel
      .findById(id)
      .populate("userId")
      .populate("courseId");
  },

  updateStudentCertificateStatus: async (id, status) => {
    return await studentCertificateModel.findByIdAndUpdate(
      id,
      { certificateStatus: status },
      { new: true }
    );
  },

  deleteStudentCertificate: async (id) => {
    return await studentCertificateModel.findByIdAndDelete(id);
  }
};
