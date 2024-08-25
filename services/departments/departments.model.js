const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    departments: [{ type: String }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const departmentModel = mongoose.model("departments", departmentSchema);

module.exports = departmentModel;
