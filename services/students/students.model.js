const mongoose = require("mongoose");
const commonHelpers = require("../../helpers/common.helper");
const userServices = require("../users/user.service");
const { STUDENT } = require("../../constants/roles.constant");
const { sendMailWithServices } = require("../../helpers/mail.helper");
const createError = require("http-errors");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    collegeUserId: {
      type: mongoose.Types.ObjectId,
      ref: "colleges",
      required: true,
    },
    batchId: {
      type: mongoose.Types.ObjectId,
      ref: "batches",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    department: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    passoutYear: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    semester: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    active: {
      type: Boolean,
      default: true,
    },
    colName: {
      type: String,
    },
    colCode: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

studentSchema.pre("save", async function (next) {
  console.log("creating hook");
  // const password = commonHelpers.generateRandomPassword();
  const password = "Admin@123";

  const userData = {
    email: this.email,
    password,
    user_name: this.name,
    permissions: [],
    role: STUDENT,
  };

  const createUser = await userServices.createUser(userData);
  if (!createUser) {
    next(createError.InternalServerError("Error creating user."));
  }
  this.userId = createUser._id;
  const to = this.email;
  const subject = "Password for Learning management system";
  const body = `Your Password for Learning management system is ${password}`;

  // sendMailWithServices(to, subject, body);
  next();
});

studentSchema.index({ rollNo: 1, userId: 1, email: 1 }, { unique: true });

const studentsModel = mongoose.model("students", studentSchema);
module.exports = studentsModel;
