const isset = require(`isset`);
const Validate = (schema) => {
  return async (req, res, next) => {
    try {
      const requestData = req?.body;

      if (isset(requestData)) {
        const data =
          process.env.NODE_ENV === "development"
            ? { data: JSON.parse(requestData.data) }
            : { data: requestData };
        console.log("requestData datadata: ", data);
        const result = await schema.validate(data.data);
        if (result.error) {
          return res.status(200).json({
            status: false,
            message: result?.error?.details,
          });
        } else {
          req.body =
            process.env.NODE_ENV === "development" ? data.data : data.data;
          return next();
        }
      } else {
        return res.status(200).json({
          status: false,
          message: `Data must be required`,
        });
      }
    } catch (error) {
      console.log(`adminValidate error: `, error.message);
      return res.status(200).json({
        status: false,
        message: `Server validation is fail.`,
      });
    }
  };
};

module.exports = {
  Validate,
};
