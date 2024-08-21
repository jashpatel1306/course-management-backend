const mongoose = require("mongoose");

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
}

function mongoConnect() {
  // Database connection
  console.log("mongoUrl", mongoUrl);
  mongoose
    .connect(mongoUrl)
    .then(async () => {
      console.log("DB connection successful!");
      // await remindBookingBeforeAWeek();
    })
    .catch((err) => {
      console.log(err);
      console.log("Error connecting DB!");
    });
}
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = mongoConnect();
