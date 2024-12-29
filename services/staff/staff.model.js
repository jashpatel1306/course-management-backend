const mongoose = require("mongoose");

const { STAFF, SUPERADMIN } = require("../../constants/roles.constant");
const { sendMailWithServices } = require("../../helpers/mail.helper");
const createError = require("http-errors");
const commonFunctions = require("../../helpers/commonFunctions");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"]
    },
    email: {
      type: String,
      required: [true, "email is required"]
    },
    phone: {
      type: String,
      required: [true, "phone is required"]
    },
    collegeUserId: {
      type: mongoose.Types.ObjectId,
      ref: "colleges"
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    },
    permissions: [
      {
        type: String
      }
    ],
    isSuperAdmin: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, versionKey: false }
);

staffSchema.pre("save", async function (next) {
  if (this.email) {
    const existingStaff = await mongoose
      .model("users")
      .findOne({ email: this.email });
    console.log("existingStaff: ", existingStaff);
    if (existingStaff && existingStaff._id.toString() !== this._id.toString()) {
      next(createError.Conflict("Email already exists."));
    }
  }
  // const password = commonHelpers.generateRandomPassword();
  const password = "Admin@123";

  const userData = {
    email: this.email,
    password,
    user_name: this.name,
    permissions: this.permissions,
    role: this.isSuperAdmin ? SUPERADMIN : STAFF
  };
  if (userData.password) {
    userData.password = await commonFunctions.encode(userData.password);
  }
  await mongoose
    .model("users")
    .updateOne({ email: userData.email }, { ...userData }, { upsert: true });
  const createUser = await mongoose
    .model("users")
    .findOne({ email: userData.email }, { createdAt: 0, updatedAt: 0, __v: 0 });
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

staffSchema.index({ rollNo: 1, userId: 1, email: 1 }, { unique: true });

const staffModel = mongoose.model("staff", staffSchema);
module.exports = staffModel;
