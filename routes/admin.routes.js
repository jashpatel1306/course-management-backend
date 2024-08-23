const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isAdminCommonAuthenticate } = require("../helpers/auth.helper");

//----------------------------- college --------------------------------//
const collegeController = require("../controllers/college.controller");

router.post(
  "/college",
  Validate(schemas.addCollegeSchema),
  isAdminCommonAuthenticate,
  collegeController.createCollege
);

router.get(
  "/colleges/all",
  Validate(schemas.queryIdSchema),
  isAdminCommonAuthenticate,
  collegeController.getAllColleges
);

router.get(
  "/college/:id",
  isAdminCommonAuthenticate,
  collegeController.getCollegeById
);

router.patch(
  "/college-status/:id",
  isAdminCommonAuthenticate,
  collegeController.changeActiveStatus
);

module.exports = router;
