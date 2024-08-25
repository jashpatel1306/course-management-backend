const mongoose = require("mongoose");
const commonHelpers = require("../../helpers/common.helper");
userServices = require("../users/user.service");
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
      unique: true,
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
      unique: true,
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
      enum: ["male", "female", "Other"],
    },
    semester: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

studentSchema.pre("save", async function (next) {
  console.log("creating hook");
  const password = commonHelpers.generateRandomPassword();

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

  sendMailWithServices(to, subject, body);

  next();
});

const studentsModel = mongoose.model("students", studentSchema);
module.exports = studentsModel;
