const createError = require("http-errors");
const uploadService = require("../helpers/fileUpload.helper");

module.exports = {
  startUpload: async (req, res, next) => {
    const { filename, filetype } = req.body;
    // console.log("fileDetails", filename, filetype);
    try {
      const result = await uploadService.startUpload(filename, filetype);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  uploadPart: async (req, res, next) => {
    try {
      const { uploadId, key, partNumber } = req.body;
      const part = req.files.part;
      console.log("******************");
      console.log(uploadId, key, partNumber, part.size);
      console.log("******************");

      const result = await uploadService.uploadPart(
        uploadId,
        key,
        partNumber,
        part
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  completeUpload: async (req, res, next) => {
    const { uploadId, key, parts } = req.body;
    if (!parts || parts.length === 0) {
      return res
        .status(400)
        .json({ error: "No parts provided for completion." });
    }
    try {
      const result = await uploadService.completeUpload(uploadId, key, parts);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
};
