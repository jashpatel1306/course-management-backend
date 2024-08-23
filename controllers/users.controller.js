const { userServices } = require("../services");


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

  getUserProfileData: async (req, res, next) => {
    try {
      const userId = res.locals.userId;
      const user = await userServices.findUserById(userId);
      return res.status(200).json({
        success: true,
        message: "User profile data fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
