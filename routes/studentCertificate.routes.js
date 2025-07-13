const express = require("express");
const router = express.Router();

const schemas = require("../validation/validation.schemas");

const studentCertificateController = require("../controllers/studentCertificate.controller");

// Routes
router.post("/", studentCertificateController.createStudentCertificate);
router.get("/", studentCertificateController.getAllStudentCertificates);
router.get("/:id", studentCertificateController.getStudentCertificateById);
router.put("/:id/status", studentCertificateController.updateStudentCertificateStatus);
router.delete("/:id", studentCertificateController.deleteStudentCertificate);

module.exports = router;
