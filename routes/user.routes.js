const express = require("express");
const router = express.Router();
const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const {
  isAdminCommonAuthenticate,
  isAuthenticate,
  isSuperAdminAuthenticate,
} = require("../helpers/auth.helper");

const userController = require("../controllers/users.controller");
router.post(
  "/sign-in",
  Validate(schemas.logInSchema),
  userController.userSignIn
);
router.get("/profile", isAuthenticate, userController.getUserProfileData);
router.post(
  "/reset-password",
  Validate(schemas.resetForgotPasswordSchema),
  isAuthenticate,
  userController.resetForgotPassword
);
router.put(
  `/update-user-profile`,
  Validate(schemas.editUserSchemas),
  isAuthenticate,
  userController.updateUserProfile
);

router.post(
  "/forgot-password",
  Validate(schemas.forgotPasswordSchema),
  userController.forgotPassword
);

router.post(
  "/verify-otp",
  Validate(schemas.otpSchema),
  userController.verifyOtp
);
router.put(
  "/password-change",
  Validate(schemas.changePasswordSchema),
  userController.changePassword
);
module.exports = router;
