// const admin = require("./admin.routes");
const user = require("./user.routes");
// const common = require("./common.routes");
module.exports = {
  userAPI: (app) => {
    // app.use("/admin", admin);
    app.use("/user", user);
    // app.use("/common", common);
  },
};
