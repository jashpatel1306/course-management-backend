const createError = require("http-errors");
const uploadService = require("../helpers/fileUpload.helper");

module.exports = {
  startUpload: async (req, res, next) => {
    const { fileName, fileType } = req.body;
    console.log("fileDetails", fileName, fileType)
    try {
      const result = await uploadService.startUpload(fileName, fileType);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  uploadPart: async (req, res, next) => {

    try {
        const { fileName, partNumber, uploadId } = req.body;
        const fileChunk = req.files.fileChunk;
        console.log("fileChunk", req.files)
        if (!fileChunk) {
          throw createError(400, "UploadPart not found.");
        }
    
      const result = await uploadService.uploadPart(
        fileName,
        partNumber,
        uploadId,
        fileChunk.data
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  completeUpload: async (req, res) => {
    const { fileName, uploadId, parts } = req.body;

    try {
      const result = await uploadService.completeUpload(
        fileName,
        uploadId,
        parts
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
};
