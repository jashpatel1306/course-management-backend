const admin = require("./admin.routes");
const user = require("./user.routes");
const student = require("./student.routes");
const instructor = require("./instructor.routes");
const templateCertificateRoutes = require("./templateCertificate.routes");
const studentCertificateRoutes = require("./studentCertificate.routes");

module.exports = {
  userAPI: (app) => {
    app.use("/admin", admin);
    app.use("/user", user);
    app.use("/student", student);
    app.use("/instructor", instructor);
    app.use("/api/template-certificates", templateCertificateRoutes);
    app.use("/api/student-certificates", studentCertificateRoutes);
  }
};
