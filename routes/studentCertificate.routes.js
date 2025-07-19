const express = require("express");
const router = express.Router();

const schemas = require("../validation/validation.schemas");

const studentCertificateController = require("../controllers/studentCertificate.controller");
const {
  isStudentAuthenticate,
  isAdminCommonAuthenticate
} = require("../helpers/auth.helper");
const { Validate } = require("../validation/validation.methods");

// Routes
router.post(
  "/",
  Validate(schemas.studentCertificateSchema),
  isStudentAuthenticate,
  studentCertificateController.createStudentCertificate
);

router.post(
  "/all",
  Validate(schemas.allCertificateSchema),
  isAdminCommonAuthenticate,
  studentCertificateController.getAllCertificates
);
router.post(
  "/certificate-visibility",
  Validate(schemas.changesCertificateVisibilitySchema),
  isAdminCommonAuthenticate,
  studentCertificateController.changesCertificatesResultVisibility
);

router.post(
  "/approve/:id",
  Validate(schemas.allCertificateSchema),
  isAdminCommonAuthenticate,
  studentCertificateController.approveStudentCertificate
);

router.get(
  "/",
  isStudentAuthenticate,
  studentCertificateController.getAllStudentCertificates
);
router.get(
  "/:id",
  isStudentAuthenticate,
  studentCertificateController.getStudentCertificateById
);
router.put(
  "/:id/status",
  isStudentAuthenticate,
  studentCertificateController.updateStudentCertificateStatus
);
router.delete(
  "/:id",
  isStudentAuthenticate,
  studentCertificateController.deleteStudentCertificate
);

module.exports = router;
