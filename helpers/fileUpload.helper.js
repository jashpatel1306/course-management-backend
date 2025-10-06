const path = require(`path`);
const AWS = require(`aws-sdk`);
const sharp = require("sharp");
const randomstring = require(`randomstring`);
const fs = require(`fs`);
const limit = 60;
const baseUrl = `content/images/`;

const awsConfig = {
  accessKeyId: process.env.AWS_S3_ACCESSKEYID,
  secretAccessKey: process.env.AWS_S3_SECRETKEY,
  region: process.env.AWS_S3_REGION,
};
AWS.config.update(awsConfig);

const s3 = new AWS.S3();
module.exports = {
  // =================================== Upload files on AWS server =================================== //
  uploadMaterialToAWS: (fileData, path) => {
    return new Promise(async (resolve, reject) => {
      try {
        const acceptFiles = [
          `image/svg`,
          `image/svg+xml`,
          `image/png`,
          `image/webp`,
          `image/avif`,
          `image/x-citrix-png`,
          `image/x-png`,
          `image/jpeg`,
          `image/jpg`,
          `image/x-citrix-jpeg`,
          `image/bmp`,
          `avatar/svg`,
          `avatar/svg+xml`,
          `avatar/png`,
          `avatar/webp`,
          `avatar/x-citrix-png`,
          `avatar/x-png`,
          `avatar/jpeg`,
          `avatar/jpg`,
          `avatar/x-citrix-jpeg`,
          `avatar/bmp`,
          `video/mp4`,
          `video/avi`,
          `application/octet-stream`,
        ];
        const allowedExtension = [
          `png`,
          `jpg`,
          `jpeg`,
          `svg`,
          `mp4`,
          `avi`,
          `webp`,
        ];
        const fileExt = fileData?.name
          ?.split(`.`)
          [fileData?.name?.split(`.`)?.length - 1]?.toLowerCase();
        // let fileName = fileData.name
        const contentType = fileData.mimetype;
        const ContentEncoding = fileData.encoding;
        const fileSize = fileData.size;
        const fileNameAWS =
          randomstring.generate({ length: 20, charset: `numeric` }) + `.webp`;
        const sizeLimit = limit * 1024 * 1024;
        // if (fileSize > sizeLimit)
        //   return resolve({
        //     status: false,
        //     message: `File size cannot exceed 2MB.`,
        //   });
        if (
          !acceptFiles.includes(contentType) ||
          !allowedExtension?.includes(fileExt)
        )
          return resolve({
            status: false,
            message: `Please upload a supported image format, such as *.png, *.svg, *.jpg, *.jpeg. *.mp4 *.avi ,*.webp`,
          });

        const awsConfig = {
          accessKeyId: process.env.AWS_S3_ACCESSKEYID,
          secretAccessKey: process.env.AWS_S3_SECRETKEY,
          region: process.env.AWS_S3_REGION,
        };
        AWS.config.update(awsConfig);

        const awsKey = baseUrl + path + fileNameAWS;

        const s3 = new AWS.S3();
        const fileContent = Buffer.from(fileData.data, `binary`);
        const webpBuffer = await sharp(fileContent)
          // .resize(resizedWidth, resizedHeight)
          .toFormat("webp")
          .toBuffer();
        console.log("webpBuffer", webpBuffer);
        // Setting up S3 upload parameters
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: awsKey, // File name you want to save as in S3
          Body: webpBuffer,
          ContentEncoding: ContentEncoding,
          ContentType: "image/webp",
        };
        s3.upload(params, function (err, data) {
          if (err) {
            console.log("err: ", err);
            return resolve({
              status: false,
              message: `Error uploading image on s3.`,
            });
          }
          return resolve({ status: true, data: data?.Location });
        });
      } catch (error) {
        console.log("uploadMaterialToAWS error : ", error);
        return reject({ status: false, error: error?.message });
      }
    });
  },
  uploadFileMaterialToAWS: (fileData, path) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("fileData : ", fileData);
        // Supported MIME types and file extensions
        const acceptFiles = [
          // PDF
          "application/pdf",
          "image/png",
          "image/jpeg",
          "image/jpg",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX

          // Microsoft Office formats
          "application/vnd.ms-powerpoint", // PPT (old)
          "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX (new)
          "application/msword", // DOC (old)
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX (new)
          "application/vnd.ms-excel", // XLS (old)
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX (new)

          "text/plain", // TXT
        ];

        const allowedExtension = [
          "pdf", // PDF
          "ppt", // PowerPoint (PPT)
          "pptx", // PowerPoint (PPTX)
          "doc", // Word (DOC)
          "docx", // Word (DOCX)
          "xls", // Excel (XLS)
          "xlsx", // Excel (XLSX)
          "png", // PNG
        ];

        const fileExt = fileData?.name
          ?.split(`.`)
          [fileData?.name?.split(`.`)?.length - 1]?.toLowerCase();

        const contentType = fileData.mimetype;
        const ContentEncoding = fileData.encoding;
        const fileSize = fileData.size;

        const fileNameAWS =
          randomstring.generate({ length: 20, charset: `numeric` }) +
          `.${fileExt}`;

        // const sizeLimit = 2 * 1024 * 1024; // 2MB size limit (example)
        // if (fileSize > sizeLimit) {
        //   return resolve({
        //     status: false,
        //     message: `File size cannot exceed 2MB.`,
        //   });
        // }

        // Check if the file is supported by extension and MIME type
        if (
          !acceptFiles.includes(contentType) ||
          !allowedExtension?.includes(fileExt)
        ) {
          return resolve({
            status: false,
            message: `Please upload a supported file format: PDF, PPTX, DOC, DOCX, PNG, JPEG, MP4, AVI.`,
          });
        }

        const awsConfig = {
          accessKeyId: process.env.AWS_S3_ACCESSKEYID,
          secretAccessKey: process.env.AWS_S3_SECRETKEY,
          region: process.env.AWS_S3_REGION,
        };
        AWS.config.update(awsConfig);

        const awsKey = baseUrl + path + fileNameAWS;

        const s3 = new AWS.S3();
        let fileContent;

        // For other files like PDF, DOCX, PPTX, use the raw buffer
        fileContent = Buffer.from(fileData.data, `binary`);

        // S3 upload parameters
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: awsKey, // S3 key (file name)
          Body: fileContent,
          ContentEncoding: ContentEncoding,
          ContentType: contentType,
        };

        // Upload to S3
        s3.upload(params, function (err, data) {
          if (err) {
            return resolve({
              status: false,
              message: `Error uploading file to S3.`,
            });
          }
          return resolve({ status: true, data: data?.Location });
        });
      } catch (error) {
        console.log("uploadMaterialToAWS error : ", error);
        return reject({ status: false, error: error?.message });
      }
    });
  },
  // =================================== Multiple files Upload on AWS server =================================== //
  uploadMultipleMaterialToAWS: (fileData, path) => {
    return new Promise(async (resolve, reject) => {
      try {
        let ImageArray = [];
        for (i = 0; i < fileData?.length; i++) {
          const acceptFiles = [
            `image/svg`,
            `image/svg+xml`,
            `image/png`,
            `image/webp`,
            `image/avif`,
            `image/x-citrix-png`,
            `image/x-png`,
            `image/jpeg`,
            `image/jpg`,
            `image/x-citrix-jpeg`,
            `image/bmp`,
            `images/svg`,
            `images/svg+xml`,
            `images/png`,
            `images/webp`,
            `images/x-citrix-png`,
            `images/x-png`,
            `images/jpeg`,
            `images/jpg`,
            `images/x-citrix-jpeg`,
            `images/bmp`,
            `avatar/svg`,
            `avatar/svg+xml`,
            `avatar/png`,
            `avatar/webp`,
            `avatar/x-citrix-png`,
            `avatar/x-png`,
            `avatar/jpeg`,
            `avatar/jpg`,
            `avatar/x-citrix-jpeg`,
            `avatar/bmp`,
            `video/mp4`,
            `video/avi`,
            `application/octet-stream`,
          ];
          const allowedExtension = [
            `png`,
            `jpg`,
            `jpeg`,
            `svg`,
            `mp4`,
            `avi`,
            `webp`,
          ];

          const fileExt = fileData[i]?.name
            ?.split(`.`)
            [fileData[i]?.name?.split(`.`)?.length - 1]?.toLowerCase();
          const contentType = fileData[i]?.mimetype;

          const ContentEncoding = fileData[i]?.encoding;
          const fileSize = fileData[i]?.size;

          const fileNameAWS =
            randomstring.generate({ length: 20, charset: `numeric` }) + `.webp`;
          const sizeLimit = limit * 1024 * 1024;
          if (fileSize > sizeLimit)
            return resolve({
              status: false,
              message: `File size cannot exceed ${limit} MB.`,
            });
          if (
            !acceptFiles.includes(contentType) ||
            !allowedExtension.includes(fileExt)
          )
            return resolve({
              status: false,
              message: `Please upload a supported image format, such as *.png, *.svg, *.jpg, *.jpeg. *.mp4 *.avi,*.webp`,
            });

          const awsConfig = {
            accessKeyId: process.env.AWS_S3_ACCESSKEYID,
            secretAccessKey: process.env.AWS_S3_SECRETKEY,
            region: process.env.AWS_S3_REGION,
          };
          AWS.config.update(awsConfig);

          const awsKey = baseUrl + path + fileNameAWS;

          const s3 = new AWS.S3();
          const fileContent = Buffer.from(fileData[i]?.data, `binary`);
          const webpBuffer = await sharp(fileContent)
            // .resize(resizedWidth, resizedHeight)
            .toFormat("webp")
            .toBuffer();
          // Setting up S3 upload parameters
          const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: awsKey, // File name you want to save as in S3
            Body: webpBuffer,
            ContentEncoding: ContentEncoding,
            ContentType: "image/webp",
          };
          s3.upload(params, function (err, data) {
            if (err)
              return resolve({
                status: false,
                message: `Error uploading image on s3.`,
              });

            ImageArray.push(data?.Location);
            if (ImageArray?.length === fileData?.length) {
              return resolve({ status: true, data: ImageArray });
            }
          });
        }
      } catch (error) {
        console.log("uploadMultipleMaterialToAWS error : ", error);
        return reject({ status: false, error: error });
      }
    });
  },
  //========================== Upload files on Local server ==================================
  uploadMaterialToLocal: (fileData, path) => {
    return new Promise(async (resolve, reject) => {
      try {
        path = `publish/` + path;
        let dir = `./` + path;
        if (!fs.existsSync(dir))
          await fs.mkdir(dir, { recursive: true }, (err) => {});
        const fileName =
          randomstring.generate({ length: 20, charset: `numeric` }) +
          `.` +
          fileData?.name?.split(` `)?.join(`-`);
        await fileData.mv(dir + fileName, function (err, data) {
          if (err)
            return resolve({
              status: false,
              message: `Error uploading image on local.`,
            });
          return resolve({ status: true, data: path + fileName });
        });
      } catch (error) {
        console.log("uploadMaterialToLocal error : ", error);
        return reject({ status: false, error: error });
      }
    });
  },
  //========================== Multiple files Upload on Local server ==================================
  uploadMultipleMaterialToLocal: (fileData, path) => {
    return new Promise(async (resolve, reject) => {
      try {
        path = `uploads/` + path;
        let dir = `./` + path;
        let ImageArray = Array();
        for (i = 0; i < fileData?.length; i++) {
          if (!fs.existsSync(dir))
            await fs.mkdir(dir, { recursive: true }, (err) => {});
          const fileName =
            randomstring.generate({ length: 20, charset: `numeric` }) +
            `.` +
            fileData[i]?.name?.split(` `)?.join(`-`);
          ImageArray?.push(path + fileName);
          await fileData[i]?.mv(dir + fileName, function (err, data) {
            if (err)
              return resolve({
                status: false,
                message: `Error uploading image on local.`,
              });
            return resolve({ status: true, data: ImageArray });
          });
        }
      } catch (error) {
        console.log("uploadMultipleMaterialToLocal error : ", error);
        return reject({ status: false, error: error });
      }
    });
  },
  // =================================== Delete files on AWS server =================================== //
  deleteMaterialToAWS: (path) => {
    return new Promise((resolve, reject) => {
      try {
        const awsConfig = {
          accessKeyId: process.env.AWS_S3_ACCESSKEYID,
          secretAccessKey: process.env.AWS_S3_SECRETKEY,
          region: process.env.AWS_S3_REGION,
        };
        AWS.config.update(awsConfig);

        const awsKey = path?.split(`.com/`)[1];

        const s3 = new AWS.S3();

        // Setting up S3 upload parameters
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: awsKey, // File name you want to save as in S3
        };
        s3.deleteObject(params, function (err, data) {
          if (err)
            return resolve({
              status: false,
              message: `Error uploading image on s3.`,
            });
          return resolve({ status: true });
        });
      } catch (error) {
        console.log("deleteMaterialToAWS error : ", error);
        return reject({ status: false, error: error });
      }
    });
  },
  // =================================== Delete Multiple files on AWS server =================================== //
  deleteMultipleMaterialToAWS: (paths) => {
    return new Promise((resolve, reject) => {
      try {
        let ImageArray = [];
        for (i = 0; i < paths?.length; i++) {
          const awsConfig = {
            accessKeyId: process.env.AWS_S3_ACCESSKEYID,
            secretAccessKey: process.env.AWS_S3_SECRETKEY,
            region: process.env.AWS_S3_REGION,
          };
          AWS.config.update(awsConfig);
          const awsKey = paths[i]?.split(`.com/`)[1];
          const s3 = new AWS.S3();
          // Setting up S3 upload parameters
          const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: awsKey, // File name you want to save as in S3
          };
          s3.deleteObject(params, function (err, data) {
            if (err)
              return resolve({
                status: false,
                message: `Error uploading image on s3.`,
              });
            ImageArray.push(i);
            if (ImageArray?.length === paths?.length) {
              return resolve({ status: true });
            }
          });
        }
      } catch (error) {
        console.log("deleteMultipleMaterialToAWS error : ", error);
        return reject({ status: false, error: error });
      }
    });
  },
  convertWebp: async () => {
    const awsConfig = {
      accessKeyId: process.env.AWS_S3_ACCESSKEYID,
      secretAccessKey: process.env.AWS_S3_SECRETKEY,
      region: process.env.AWS_S3_REGION,
    };
    AWS.config.update(awsConfig);
    const s3 = new AWS.S3();
    const Bucket = process.env.AWS_S3_BUCKET; // Replace with your S3 bucket name
    try {
      // List all objects (images) in the bucket
      const objects = await s3.listObjectsV2({ Bucket }).promise();

      // Convert each image to WebP format
      await Promise.all(
        objects.Contents.map(async (object) => {
          const Key = object.Key;
          const ContentEncoding = object.encoding;
          const image = await s3.getObject({ Bucket, Key }).promise();
          // const webpBuffer = await sharp(image.Body).resize(resizedWidth).toFormat("webp").toBuffer();
          // const webpBuffer = await sharp(image.Body)
          //   .resize(resizedWidth)
          //   .toBuffer();
          const webpBuffer = await sharp(image.Body)
            ?.resize(resizedWidth, resizedHeight)
            ?.toBuffer();

          // Upload the converted image to S3 with a new Key
          // const newKey = Key?.replace(/\.\w+$/, ".webp");
          await s3
            .putObject({
              Bucket: Bucket,
              Key: Key,
              Body: webpBuffer,
              ContentEncoding: ContentEncoding,
              ContentType: "image/webp",
            })
            .promise();
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify("All images converted to WebP successfully"),
      };
    } catch (error) {
      console.error("Error converting images Error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify("Error converting images"),
      };
    }
  },

  startUpload: async (fileName, fileType) => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${new Date().getTime()}-${fileName}`,
      ContentType: fileType,
      ACL: "private",
    };

    try {
      const upload = await s3.createMultipartUpload(params).promise();
      return { uploadId: upload.UploadId, key: params.Key };
    } catch (error) {
      throw new Error("Error initiating upload: " + error.message);
    }
  },
  uploadPart: async (uploadId, key, partNumber, part) => {
    const buffer = Buffer.from(part.data, `binary`);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: buffer,
    };

    try {
      const uploadParts = await s3.uploadPart(params).promise();
      return { ETag: uploadParts.ETag, PartNumber: partNumber };
    } catch (error) {
      throw new Error("Error uploading part: " + error.message);
    }
  },
  completeUpload: async (uploadId, key, parts) => {
    // Ensure parts are correctly formatted
    const completedParts = parts.map((part) => {
      if (!part.ETag || !part.PartNumber) {
        throw new Error("Invalid part data: missing ETag or PartNumber.");
      }
      return {
        ETag: part.ETag.replace(/"/g, ""), // Remove quotes from ETag
        PartNumber: part.PartNumber,
      };
    });

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: completedParts },
    };

    try {
      const complete = await s3.completeMultipartUpload(params).promise();
      return { fileUrl: complete.Location }; // Return the URL of the uploaded file
    } catch (error) {
      console.error("Error completing upload: ", error);
      throw new Error("Error completing upload: " + error.message);
    }
  },
};
