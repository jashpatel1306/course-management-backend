const express = require("express");
const router = express.Router();
const { ValidateBody } = require("../validation/validation.methods");
const userController = require("../controllers/users.controller");
const schemas = require("../validation/validation.schemas");
const { isAdminAuthentic } = require("../helpers/auth.helper");

router.post(
  "/signIn",
  ValidateBody(schemas.logInSchema),
  userController.userSignIn
);

router.get("/profile", isAdminAuthentic, userController.getUserProfileData);
module.exports = router;
