const ADMIN = "admin";
const INSTRUCTOR = "instructor";
const SUPERADMIN = "superAdmin";
const STUDENT = "student";
const STAFF = "staff";
const ROLES = [ADMIN, INSTRUCTOR, SUPERADMIN, STUDENT, STAFF];
const adminPermissions = [
  "dashboard",
  "students",
  "batches",
  "contentHub",
  "assessment",
  "publiccontent",
  "instructors",
  "colleges",
  "staff",
  "policy",
  "configuration",
  "assessmentResult"
];
const collegePermissions = [
  "dashboard",
  "students",
  "batches",
  "contentHub",
  "assessment",
  "publiccontent",
  "instructors",
  "staff",
  "policy",
  "configuration",
  "assessmentResult"
];
module.exports = {
  SUPERADMIN,
  ADMIN,
  INSTRUCTOR,
  STUDENT,
  STAFF,
  ROLES,
  adminPermissions,
  collegePermissions
};
