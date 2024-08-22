const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "college", "student", "staff"],
    },
    profileImage: {
      type: String,
    },
    permissions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
