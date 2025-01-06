const express = require("express");
const router = express.Router();

const { Validate } = require("../validation/validation.methods");
const schemas = require("../validation/validation.schemas");
const {
  isSuperAdminAuthenticate,
  isAdminCommonAuthenticate,
} = require("../helpers/auth.helper");

//----------------------------- college --------------------------------//
const collegeController = require("../controllers/college.controller");
const instructorCourseController = require("../controllers/instructorCourse.controller");
const batcheController = require("../controllers/batches.controller");
const publicLinkController = require("../controllers/publicLink.controller");
const dashboardController = require("../controllers/dashboard.controller");

router.post(
  "/college",
  Validate(schemas.addCollegeSchema),
  isSuperAdminAuthenticate,
  collegeController.createCollege
);

router.post(
  "/colleges/all/:status",
  Validate(schemas.searchPaginationSchema),
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
router.get(
  "/college-option",
  isAdminCommonAuthenticate,
  collegeController.getCollegesOption
);

router.get(
  "/batches-option/:collegeId",
  isAdminCommonAuthenticate,
  batcheController.getBatchesOption
);

//----------------------- publiclink courses------------------------//

router.post(
  "/public-link",
  Validate(schemas.publicLinkSchema),
  isAdminCommonAuthenticate,
  publicLinkController.createPublicLink
);

router.post(
  "/public-link/all",
  Validate(schemas.paginationAndFilterSchema),

  isAdminCommonAuthenticate,
  publicLinkController.getAllPublicLink
);

router.post(
  "/public-link/:id",

  isAdminCommonAuthenticate,
  publicLinkController.getPublicLinkById
);

router.put(
  "/public-link/:id",
  Validate(schemas.publicLinkSchema),
  isAdminCommonAuthenticate,
  publicLinkController.updatePublicLink
);

router.put(
  "/public-link/status/:id",
  isAdminCommonAuthenticate,
  publicLinkController.activeStatusChange
);
router.delete(
  "/public-link/:id",
  isAdminCommonAuthenticate,
  publicLinkController.deletePublicLink
);

//--------------------------------dashboard--------------------------------//

router.post(
  "/dashboard",
  Validate(schemas.dateFilterSchema),
  isAdminCommonAuthenticate,
  dashboardController.getAdminDashboardData
);

module.exports = router;
