const mongoose = require("mongoose");
const { ROLES } = require("../../constants/roles.constant");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ROLES,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colleges",
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const userSessionModel = mongoose.model("userSessions", sessionSchema);

module.exports = userSessionModel;
