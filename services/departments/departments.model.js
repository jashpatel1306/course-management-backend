const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colleges",
      required: true,
    },
    department: { type: String, required: true, set: (v) => v.trim().toLowerCase() },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
departmentSchema.index({ collegeId: 1, department: 1 }, { unique: true });

const departmentModel = mongoose.model("departments", departmentSchema);

module.exports = departmentModel;
