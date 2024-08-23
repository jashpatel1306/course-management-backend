const CryptoJS = require(`crypto-js`);
const secretKey = process.env.JWT_SECRET_KEY;
// =================================== Encode request Data =================================== //
module.exports.encode = async (text) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        secretKey
      ).toString();
      return resolve(data);
    } catch (error) {
      console.log(`encode error:`, error);
      return reject({
        status: false,
        message: `Something is wrong while send request.`,
      });
    }
  });
};

// =================================== Decosde request Data =================================== //
module.exports.decode = async (text, option = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bytes = CryptoJS.AES.decrypt(text, secretKey);
      const originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      if (option) {
        return resolve({ status: true, data: originalText });
      } else {
        return resolve(originalText);
      }
    } catch (error) {
      console.log(`decode error:`, error);
      return reject({
        status: false,
        message: `Something is wrong while send request.`,
      });
    }
  });
};
// =================================== Response  request Data =================================== //
module.exports.responseDataEncode = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.NODE_ENV === "development") {
        return resolve(data);
      } else {
        const result = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          secretKey
        ).toString();
        return resolve(result);
      }
    } catch (error) {
      console.log(`responseDataEncode error:`, error);
      return reject({
        status: false,
        message: `Something is wrong while send request.`,
      });
    }
  });
};
