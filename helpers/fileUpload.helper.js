const path = require(`path`);
const AWS = require(`aws-sdk`);
const sharp = require("sharp");
const randomstring = require(`randomstring`);
const fs = require(`fs`);
const limit = 60;
const baseUrl = `content/images/`;
// const resizedWidth = 800;
// const resizedHeight = 600;
// =================================== Upload files on AWS server =================================== //
module.exports.uploadMaterialToAWS = (fileData, path) => {
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
      if (fileSize > sizeLimit)
        return resolve({
          status: false,
          message: `File size cannot exceed 2MB.`,
        });
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
        return resolve({ status: true, data: data?.Location });
      });
    } catch (error) {
      console.log("uploadMaterialToAWS error : ", error);
      return reject({ status: false, error: error?.message });
    }
  });
};
// =================================== Multiple files Upload on AWS server =================================== //
module.exports.uploadMultipleMaterialToAWS = (fileData, path) => {
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
};
//========================== Upload files on Local server ==================================
module.exports.uploadMaterialToLocal = (fileData, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      path = `public/` + path;
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
};
//========================== Multiple files Upload on Local server ==================================
module.exports.uploadMultipleMaterialToLocal = (fileData, path) => {
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
};
// =================================== Delete files on AWS server =================================== //
module.exports.deleteMaterialToAWS = (path) => {
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
};
// =================================== Delete Multiple files on AWS server =================================== //
module.exports.deleteMultipleMaterialToAWS = (paths) => {
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
};
module.exports.convertWebp = async () => {
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
};


const awsConfig = {
  accessKeyId: process.env.AWS_S3_ACCESSKEYID,
  secretAccessKey: process.env.AWS_S3_SECRETKEY,
  region: process.env.AWS_S3_REGION,
};
AWS.config.update(awsConfig);


const s3 = new AWS.S3();
module.exports = {
  startUpload: async (fileName, fileType) => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
    };

    try {
      const upload = await s3.createMultipartUpload(params).promise();
      return { uploadId: upload.UploadId };
    } catch (error) {
      throw new Error("Error initiating upload: " + error.message);
    }
  },

  uploadPart: async (fileName, partNumber, uploadId, fileChunk) => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: fileChunk,
    };

    try {
      const uploadParts = await s3.uploadPart(params).promise();
      return { ETag: uploadParts.ETag };
    } catch (error) {
      throw new Error("Error uploading part: " + error.message);
    }
  },

  completeUpload: async (fileName, uploadId, parts) => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    try {
      const complete = await s3.completeMultipartUpload(params).promise();
      return { fileUrl: complete.Location };
    } catch (error) {
      throw new Error("Error completing upload: " + error.message);
    }
  }
};
