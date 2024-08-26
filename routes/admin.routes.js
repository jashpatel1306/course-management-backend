const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const { isSuperAdminAuthenticate } = require("../helpers/auth.helper");

//----------------------------- college --------------------------------//
const collegeController = require("../controllers/college.controller");

router.post(
  "/college",
  Validate(schemas.addCollegeSchema),
  isSuperAdminAuthenticate,
  collegeController.createCollege
);

router.post(
  "/colleges/all/:status",
  Validate(schemas.searchPaginationScema),
  isSuperAdminAuthenticate,
  collegeController.getAllColleges
);

router.get(
  "/college/:id",
  isSuperAdminAuthenticate,
  collegeController.getCollegeById
);

router.patch(
  "/college-status/:id",
  isSuperAdminAuthenticate,
  collegeController.changeActiveStatus
);

module.exports = router;
