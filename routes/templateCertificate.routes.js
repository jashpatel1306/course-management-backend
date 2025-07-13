const express = require("express");
const schemas = require("../validation/validation.schemas");
const templateCertificateController = require("../controllers/templateCertificate.controller");
const router = express.Router();

// Routes
router.post("/", templateCertificateController.createCertificate);
router.get("/", templateCertificateController.getAllCertificates);
router.get("/:id", templateCertificateController.getCertificateById);
router.put("/:id", templateCertificateController.updateCertificate);
router.delete("/:id", templateCertificateController.deleteCertificate);

module.exports = router;
