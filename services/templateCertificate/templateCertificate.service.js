const templateCertificateModel = require("./templateCertificate.model");

module.exports = {
  createTemplateCertificate: async (data) => {
    const existingTemplate = await templateCertificateModel.findOne({
      collegeId: data.collegeId
    });
    if (existingTemplate) {
      // console.log("data", existingTemplate._id, data);
      return await templateCertificateModel.updateOne(
        { _id: existingTemplate._id },
        data,
        { new: true }
      );
    }
    return await templateCertificateModel.create(data);
  },

  getAllTemplateCertificates: async () => {
    return await templateCertificateModel.find();
  },

  getTemplateCertificateById: async (id) => {
    return await templateCertificateModel.findById(id);
  },

  updateTemplateCertificate: async (id, updateData) => {
    return await templateCertificateModel.findByIdAndUpdate(id, updateData, {
      new: true
    });
  },

  deleteTemplateCertificate: async (id) => {
    return await templateCertificateModel.findByIdAndDelete(id);
  }
};
