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
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    },
    permissions: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
