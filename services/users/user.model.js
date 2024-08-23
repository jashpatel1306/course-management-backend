const mongoose = require("mongoose");
const { ROLES, ADMIN } = require("../../constants/roles.constant");
const commonFunctions = require("../../helpers/commonFunctions");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, `email is required`],
    },
    password: {
      type: String,
      required: [true, `password is required`],
    },
    user_name: {
      type: String,
      required: [true, `user_name is required`],
    },
    permissions: [
      {
        type: String,
      },
    ],
    avatar: {
      type: String,
      default: `https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg`,
      trim: true,
    },
    role: {
      type: String,
      default: ADMIN,
      trim: true,
      enum: ROLES,
    },
    active: {
      type: Boolean,
      default: true,
    },
    otp:{
      type: String,
    }
  },
  { timestamps: true, versionKey: false }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
