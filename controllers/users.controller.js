const userServices = require("../services/users.services");
const createError = require("http-errors");

module.exports = {
  userSignIn: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const email = reqBody.email;
      const password = reqBody.password;

      const { accessToken, user } = await userServices.userSignIn(
        email,
        password
      );
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          token: accessToken,
          userData: user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
