const express = require("express");
const router = express.Router();

const schemas = require("../validation/validation.schemas");

const studentCertificateController = require("../controllers/studentCertificate.controller");
const { isStudentAuthenticate } = require("../helpers/auth.helper");
const { Validate } = require("../validation/validation.methods");

// Routes
router.post(
  "/",
  Validate(schemas.studentCertificateSchema),
  isStudentAuthenticate,
  studentCertificateController.createStudentCertificate
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
