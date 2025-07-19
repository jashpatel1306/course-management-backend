const mongoose = require("mongoose");

const generateCertificateNumber = () => {
  const datePart = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 8);
  const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${datePart}${randomPart}`.slice(0, 15);
};

const studentCertificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true
    },
    certificationNumber: {
      type: String,
      unique: true,
      default: generateCertificateNumber
    },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colleges",
      required: true
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batches",
      required: true
    },
    certificateStatus: {
      type: Boolean,
      default: false
    },

    // Copy from template certificate
    companyLogo1: { type: String },
    companyLogo2: { type: String },
    signature1: { type: String },
    signatory1Name: { type: String },
    signatory1Title: { type: String },
    signature2: { type: String },
    signatory2Name: { type: String },
    signatory2Title: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const studentCertificateModel = mongoose.model("studentCertificates",studentCertificateSchema);

module.exports = studentCertificateModel;
