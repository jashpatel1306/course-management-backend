const isset = require("isset");



const ValidateBody = (schema) => {
  return (req, res, next) => {
    const reqData = req.body;

    const { error, value } = schema.validate(reqData);

    if (error) {
      return res.status(400).json({
        success: false,
        message: `validation error: ${error.details[0].message}`,
        data: [],
      });
    }

    // Set the validated query parameters in the request object
    req.body = value;
    // Pass control to the next middleware or route handler
    next();
  };
};

const ValidateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message, data: [] });
    }

    // Set the validated query parameters in the request object
    req.query = value;

    next();
  };
};

const ValidateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message, data: [] });
    }

    // Set the validated query parameters in the request object
    req.query = value;

    next();
  };
};
module.exports = {
  ValidateBody,
  ValidateQuery,
  ValidateParams,
};
