const express = require("express");
const schemas = require("../validation/validation.schemas");
const templateCertificateController = require("../controllers/templateCertificate.controller");
const { isSuperAdminAuthenticate } = require("../helpers/auth.helper");
const { Validate } = require("../validation/validation.methods");
const router = express.Router();

// Routes
router.post(
  "/",
  Validate(schemas.certificateSchem),
  isSuperAdminAuthenticate,
  templateCertificateController.createCertificate
);
router.get(
  "/",
  isSuperAdminAuthenticate,
  templateCertificateController.getAllCertificates
);
router.get(
  "/:id",
  isSuperAdminAuthenticate,
  templateCertificateController.getCertificateById
);
router.put(
  "/:id",
  isSuperAdminAuthenticate,
  templateCertificateController.updateCertificate
);
router.delete(
  "/:id",
  isSuperAdminAuthenticate,
  templateCertificateController.deleteCertificate
);

module.exports = router;
