const isset = require("isset");
const Validate = (schema) => {
  return async (req, res, next) => {
    try {
      const requestData = req?.body;
      if (isset(requestData)) {
        const data = { data: requestData };

        const result = await schema.validate(data.data);
        if (result.error) {
          return res.status(200).json({
            status: false,
            message: result?.error?.details,
          });
        } else {
          req.body = data.data;
          return next();
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "Data must be required",
        });
      }
    } catch (error) {
      console.log(`adminValidate error: `, error.message);
      return res.status(200).json({
        status: false,
        message: "Server validation is fail.",
      });
    }
  };
};

const ValidateQueryParams = (schema) => {
  return async (req, res, next) => {
    try {
      const requestData = req?.query;
      if (isset(requestData)) {
        const data = { data: requestData };

        const result = await schema.validate(data.data);
        if (result.error) {
          return res.status(200).json({
            status: false,
            message: result?.error?.details,
          });
        } else {
          req.query = data.data;
          return next();
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "Query parameters must be required",
        });
      }
    } catch (error) {
      console.log(`adminValidateQueryParams error: `, error.message);
      return res.status(200).json({
        status: false,
        message: "Server validation is fail.",
      });
    }
  };
};

module.exports = {
  Validate,
  ValidateQueryParams,
};
