const path = require("path");
const AWS = require("aws-sdk");
const randomstring = require("randomstring");
const fs = require("fs");
const LIMIT = 60;
const baseUrl = "aggarwal-ecommerce";

// =================================== Upload files on AWS server =================================== //
module.exports.uploadMaterialToAWS = (fileData, path) => {
  return new Promise(async (resolve) => {
    const acceptFiles = [
      "image/svg",
      "image/svg+xml",
      "image/png",
      "image/x-citrix-png",
      "image/x-png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/x-citrix-jpeg",
      "application/pdf",
    ];
    const allowedExtension = ["png", "jpg", "jpeg", "svg", "pdf"];

    const fileExt = fileData.name
      .split(".")
      [fileData.name.split(".").length - 1].toLowerCase();
    // var fileName = fileData.name
    const contentType = fileData.mimetype;
    const ContentEncoding = fileData.encoding;
    const fileSize = fileData.size;
    
    // console.log("fileExt", fileExt);
    const fileNameAWS =
      randomstring.generate({ length: 20, charset: "numeric" }) +
      "." +
      fileData.name.split(" ").join("-");
    const sizeLimit = LIMIT * 1024 * 1024;
    if (fileSize > sizeLimit)
      return resolve({
        status: false,
        message: `File size cannot exceed ${LIMIT} MB`,
      });

    if (
      !acceptFiles.includes(contentType) ||
      !allowedExtension.includes(fileExt)
    )
      return resolve({
        status: false,
        message:
          "Please upload a supported image format, such as *.png, *.svg, *.jpg, *.jpeg. *.mp4 *.avi",
      });

    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_S3_REGION,
    };
    AWS.config.update(awsConfig);

    const awsKey = baseUrl + path + fileNameAWS;

    const s3 = new AWS.S3();
    const fileContent = Buffer.from(fileData.data, "binary");

    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: awsKey, // File name you want to save as in S3
      Body: fileContent,
      ContentEncoding: ContentEncoding,
      ContentType: contentType,
    };
    s3.upload(params, function (err, data) {
      if (err)
        return resolve({
          status: false,
          message: "Error uploading image on s3.",
        });
      return resolve({ status: true, data: data.Location });
    });
  });
};

// =================================== Multiple files Upload on AWS server =================================== //
module.exports.uploadMultipleMaterialToAWS = (fileData, path) => {
  return new Promise(async (resolve) => {
    let ImageArray = [];
    for (i = 0; i < fileData.length; i++) {
      // console.log("i : ",i)
      const acceptFiles = [
        "image/svg",
        "image/svg+xml",
        "image/png",
        "image/x-citrix-png",
        "image/x-png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/x-citrix-jpeg",
        "images/svg",
        "images/svg+xml",
        "images/png",
        "images/x-citrix-png",
        "images/x-png",
        "images/jpeg",
        "images/jpg",
        "images/webp",
        "images/x-citrix-jpeg",
        "application/pdf",
      ];
      const allowedExtension = ["png", "jpg", "jpeg", "svg", "pdf"];
      console.log("mime type", fileData[i].mimetype);
      const fileExt = fileData[i].name
        .split(".")
        [fileData[i].name.split(".").length - 1].toLowerCase();
      const contentType = fileData[i].mimetype;
      const ContentEncoding = fileData[i].encoding;
      const fileSize = fileData[i].size;
      const fileNameAWS =
        randomstring.generate({ length: 20, charset: "numeric" }) +
        "." +
        fileData[i].name.split(" ").join("-");
      const sizeLimit = LIMIT * 1024 * 1024;
      // console.log("fileSize : ",fileSize ,"sizeLimit :  ",sizeLimit,fileSize > sizeLimit)
      if (fileSize > sizeLimit)
        return resolve({
          status: false,
          message: `File size cannot exceed ${LIMIT} MB`,
        });
      if (
        !acceptFiles.includes(contentType) ||
        !allowedExtension.includes(fileExt)
      )
        return resolve({
          status: false,
          message:
            "Please upload a supported image format, such as *.png, *.svg, *.jpg, *.jpeg. *.mp4 *.avi",
        });

      const awsConfig = {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_S3_REGION,
      };
      AWS.config.update(awsConfig);

      const awsKey = baseUrl + path + fileNameAWS;

      const s3 = new AWS.S3();
      const fileContent = Buffer.from(fileData[i].data, "binary");

      // Setting up S3 upload parameters
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: awsKey, // File name you want to save as in S3
        Body: fileContent,
        ContentEncoding: ContentEncoding,
        ContentType: contentType,
      };
      // console.log("imageArray length: ",ImageArray.length);
      s3.upload(params, function (err, data) {
        if (err)
          return resolve({
            status: false,
            message: "Error uploading image on s3.",
          });

        ImageArray.push(data.Location);
        if (ImageArray.length === fileData.length) {
          return resolve({
            status: true,
            message: "Images Uploaded Successfully.",
            data: ImageArray,
          });
        }
      });
    }
    //   console.log("ImageArray : ",ImageArray)
    //  return resolve({ status: true, data: ImageArray });
  });
};

// =================================== Delete files on AWS server =================================== //
module.exports.deleteMaterialToAWS = (path) => {
  return new Promise((resolve) => {
    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_S3_REGION,
    };
    AWS.config.update(awsConfig);

    const awsKey = path.split(".com/")[1];

    const s3 = new AWS.S3();

    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: awsKey, // File name you want to save as in S3
    };
    s3.deleteObject(params, function (err, data) {
      if (err)
        return resolve({
          status: false,
          message: "Error Deleting image from s3.",
        });
      //  console.log("Successfully deleted file from bucket");
      return resolve({ status: true });
    });
  });
};

// =================================== Delete Multiple files on AWS server =================================== //
module.exports.deleteMultipleMaterialToAWS = (paths) => {
  return new Promise((resolve) => {
    let ImageArray = [];
    for (i = 0; i < paths.length; i++) {
      // console.log("i : ",i)

      const awsConfig = {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_S3_REGION,
      };
      AWS.config.update(awsConfig);
      const awsKey = paths[i].split(".com/")[1];
      const s3 = new AWS.S3();
      // Setting up S3 upload parameters
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: awsKey, // File name you want to save as in S3
      };
      s3.deleteObject(params, function (err, data) {
        if (err)
          return resolve({
            status: false,
            message: "Error Deleting images from s3.",
          });
        // console.log("Successfully deleted file from bucket");
        ImageArray.push(i);
        if (ImageArray.length === paths.length) {
          return resolve({ status: true });
        }
      });
    }
  });
};
