const mongoose = require("mongoose");
const { addDefaultAdmin } = require("../services/users/user.service");

mongoose.set("strictQuery", false);
require("dotenv").config();

let mongoUrl;

const environment = process.env.NODE_ENV;

switch (environment) {
  case "production":
    mongoUrl = process.env.MONGODB_PROD_URL;
    break;
  case "stage":
    mongoUrl = process.env.MONGODB_STAGE_URL;
    break;
  case "development":
    mongoUrl = process.env.MONGODB_DEV_URL;
    break;
  default:
    mongoUrl = process.env.MONGODB_DEV_URL;
    break;
}

function mongoConnect() {
  // Database connection
  mongoose
    .connect(mongoUrl)
    .then(async () => {
      addDefaultAdmin();
      console.info("DB connection successful!");
      // await remindBookingBeforeAWeek();
    })
    .catch((err) => {
      console.error(err);
      console.info("Error connecting DB!");
    });
}
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = mongoConnect();
