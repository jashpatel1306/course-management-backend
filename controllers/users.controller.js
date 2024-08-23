const { userServices } = require("../services");
const commonFunctions = require("../helpers/commonFunctions");
const commonUploadFunction = require("../helpers/fileUpload.helper");

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
        status: true,
        message: "User logged in successfully",
        data: {
          token: accessToken,
          data: user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getUserProfileData: async (req, res, next) => {
    try {
      const userId = req.body.user_id;
      const user = await userServices.findUserById(userId);

      return res.status(200).json({
        status: true,
        message: "User profile data fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  resetForgotPassword: async (req, res, next) => {
    try {
      const request_body = req?.body;
      const user = await userServices.findUserById(request_body.user_id);
      const dbPassword = await commonFunctions.decode(user.password);
      if (dbPassword !== request_body.oldPassword) {
        return res.json({
          status: false,
          message: `Please provide a valid old password.`,
        });
      }

      const setNewPassword = await userServices.resetPasswordUpdate(
        request_body.user_id,
        request_body.newPassword
      );
      return res.status(200).json({
        status: true,
        message: `The password has been successfully updated.`,
        data: setNewPassword,
      });
    } catch (error) {
      next(error);
    }
  },
  updateUserProfile: async (req, res, next) => {
    try {
      const request_body = req?.body;
      const avatar = req.files?.avatar;
      const user = await userServices.findUserById(request_body.user_id);
      if (!user)
        return res.json({
          status: false,
          message: `There is no account associated with this name or email address. Please try again.`,
        });

      if (avatar) {
        const movetoAWS = await commonUploadFunction.uploadMaterialToAWS(
          avatar,
          `profile/avatars/`
        );
        if (!movetoAWS.status)
          return res.json({
            status: false,
            message: movetoAWS.message,
            data: [],
          });
        if (movetoAWS.data) request_body.avatar = movetoAWS.data;
      }
      const result = await userServices.updateUser(
        request_body.user_id,
        request_body
      );

      return res.status(200).json({
        status: true,
        message: `The user has been successfully edited`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
