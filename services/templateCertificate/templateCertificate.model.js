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
    type: { type: String, enum: TEMPLATE_TYPES, default: "USER" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colleges",
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

templateCertificateSchema.statics.initializeDefaults = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.create({
      companyLogo1: "default_logo1.png",
      signature1: "default_signature1.png",
      signatory1Name: "Nagaveer V",
      signatory1Title: "CEO | CCC Group",

      signature2: "default_signature2.png",
      signatory2Name: "Skill Graph",
      signatory2Title: "Authorized Signatory",
      type: "DEFAULT"
    });
  }
};

const templateCertificateModel = mongoose.model(
  "templateCertificates",
  templateCertificateSchema
);

// templateCertificateModel.initializeDefaults();

module.exports = templateCertificateModel;
