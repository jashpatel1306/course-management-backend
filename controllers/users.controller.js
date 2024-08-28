const { userServices } = require("../services");
const commonFunctions = require("../helpers/commonFunctions");
const commonUploadFunction = require("../helpers/fileUpload.helper");
const createHttpError = require("http-errors");

module.exports = {
  userSignIn: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const email = reqBody.email;
      const password = reqBody.password;

      const { accessToken, user, collegeId } = await userServices.userSignIn(
        email,
        password
      );
      return res.status(200).json({
        status: true,
        message: "User logged in successfully",
        data: {
          token: accessToken,
          data: user,
          collegeId: collegeId,
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

  forgotPassword: async (req, res, next) => {
    try {
      const reqData = req?.body;

      const email = reqData.email;

      const forgotPassword = await userServices.forgotPassword(email);
      if (!forgotPassword) {
        return next(createHttpError(500, `Could not send Email`));
      }
      return res.status(200).json({
        status: true,
        message: `The OTP has been successfully sent to your Email.`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const reqData = req?.body;
      const otp = reqData.otp;
      const email = reqData.email;
      const verifyOtp = await userServices.verifyOtp(email, otp);
      if (!verifyOtp) {
        return next(createHttpError(500, `Error verifying OTP.`));
      }
      return res.status(200).json({
        status: true,
        message: `The OTP has been successfully verified.`,
        user_id: verifyOtp,
      });
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const request_body = req?.body;
      const user_id = request_body.user_id;
      const password = request_body.password;

      const changePassword = await userServices.changePassword(
        user_id,
        password
      );
      if (!changePassword) {
        return next(createHttpError(500, `Error changing password.`));
      }
      return res.status(200).json({
        status: true,
        message: `The password has been successfully changed.`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },
};
