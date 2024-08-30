const admin = require("./admin.routes");
const user = require("./user.routes");
const student = require("./student.routes");
module.exports = {
  userAPI: (app) => {
    app.use("/admin", admin);
    app.use("/user", user);
    app.use("/student", student);
  },
};
