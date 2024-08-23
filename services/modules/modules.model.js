const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const modulesModel = mongoose.model("modules", moduleSchema);
module.exports = modulesModel;
