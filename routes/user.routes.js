const express = require("express");
const router = express.Router();
const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isAdminCommonAuthenticate } = require("../helpers/auth.helper");

const userController = require("../controllers/users.controller");
router.post(
  "/signIn",
  Validate(schemas.logInSchema),
  userController.userSignIn
);

router.get("/profile",isAdminCommonAuthenticate, userController.getUserProfileData);
module.exports = router;
