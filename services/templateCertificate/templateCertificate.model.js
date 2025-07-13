const mongoose = require("mongoose");

const TEMPLATE_TYPES = ["DEFAULT", "USER"];

const templateCertificateSchema = new mongoose.Schema(
  {
    companyLogo1: { type: String, required: true },
    companyLogo2: { type: String },

    signature1: { type: String, required: true },
    signatory1Name: { type: String, required: true },
    signatory1Title: { type: String },

    signature2: { type: String, required: true },
    signatory2Name: { type: String, required: true },
    signatory2Title: { type: String },

    type: { type: String, enum: TEMPLATE_TYPES, default: "DEFAULT" },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const templateCertificateModel = mongoose.model(
  "templateCertificates",
  templateCertificateSchema
);

module.exports = templateCertificateModel;
