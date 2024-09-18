const createHttpError = require("http-errors");
var commonUploadFunction = require("../helpers/fileUpload.helper");
const createError = require("http-errors");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
});
module.exports = {
  // upload image Data
  uploadImage: async (req, res, next) => {
    try {
      const image = req.files?.image;
      const path = "uploads/" + req.body.path;
      if (!image) {
        return next(
          createError.BadRequest("File is required, Please try again.")
        );
      }

      const uploadToAWS = await commonUploadFunction.uploadFileMaterialToAWS(
        image,
        path
      );

      if (uploadToAWS.status) {
        return res.status(200).json({
          success: true,
          message: "File uploaded successfully.",
          data: uploadToAWS.data,
        });
      } else {
        return next(createError.InternalServerError(uploadToAWS.message));
      }
    } catch (err) {
      next(
        createError.InternalServerError(
          "Something is wrong in upload Image.Please try again."
        )
      );
    }
  },
  // upload multiple image Data
  uploadMultipleImage: async (req, res, next) => {
    try {
      const images = req.files?.images;
      const path = "implant-docz/uploads/";

      if (!images) return next(createError.BadRequest("Image is required."));

      const uploadToAWS =
        await commonUploadFunction.uploadMultipleMaterialToAWS(images, path);
      return res.status(200).json(uploadToAWS);
    } catch (err) {
      next(
        createError.InternalServerError(
          "Something is wrong in upload Images.Please try again."
        )
      );
    }
    f;
  },
  // delete image Data
  deleteImage: async (req, res, next) => {
    try {
      const originalData = req.body;
      const ImagePath = originalData.path;
      const movetoLocal = await commonUploadFunction.deleteMaterialToAWS(
        ImagePath
      );
      return res.json({ success: true, message: movetoLocal });
    } catch (err) {
      next(
        createError.InternalServerError(
          "Something is wrong in Image Deletion.Please try again."
        )
      );
    }
  },
  // delete multiple image Data
  deleteMultipleImage: async (req, res, next) => {
    try {
      const originalData = req.body;
      const ImagePaths = originalData.path;
      const movetoLocal =
        await commonUploadFunction.deleteMultipleMaterialToAWS(
          JSON.parse(ImagePaths)
        );

      return res.json({ success: true, message: movetoLocal });
    } catch (err) {
      next(
        createError.InternalServerError(
          "Something is wrong in Image Deletion.Please try again."
        )
      );
    }
  },
};
