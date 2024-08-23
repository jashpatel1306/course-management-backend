const mongoose = require("mongoose");
const { ADMIN, ROLES } = require("../constants/roles.constant");

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
      default: `https://espo-live.s3.us-west-1.amazonaws.com/content/images/logo/30698015106821034319.webp`,
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
  },
  { timestamps: true, versionKey: false }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
