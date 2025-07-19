const express = require("express");
const schemas = require("../validation/validation.schemas");
const templateCertificateController = require("../controllers/templateCertificate.controller");
const { isAdminCommonAuthenticate } = require("../helpers/auth.helper");
const { Validate } = require("../validation/validation.methods");
const router = express.Router();

// Routes
router.post(
  "/",
  Validate(schemas.certificateSchema),
  isAdminCommonAuthenticate,
  templateCertificateController.createCertificate
);

router.get(
  "/",
  isAdminCommonAuthenticate,
  templateCertificateController.getAllCertificates
);

router.get(
  "/:id",
  isAdminCommonAuthenticate,
  templateCertificateController.getCertificateById
);

router.put(
  "/:id",
  isAdminCommonAuthenticate,
  templateCertificateController.updateCertificate
);

router.delete(
  "/:id",
  isAdminCommonAuthenticate,
  templateCertificateController.deleteCertificate
);

module.exports = router;
