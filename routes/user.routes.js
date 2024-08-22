const express = require("express");
const router = express.Router();
const { ValidateBody } = require("../validation/validation.methods");
const userController = require("../controllers/users.controller");
const schemas = require("../validation/validation.schemas");

router.post(
  "/signIn",
  ValidateBody(schemas.logInSchema),
  userController.userSignIn
);

module.exports = router;
