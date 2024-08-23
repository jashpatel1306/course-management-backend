const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var expressFile = require("express-fileupload");
const path = require("path");
const router = require("./routes/index");
const PORT = process.env.PORT || 3030;
const app = express();

//postgres connection

app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(expressFile());
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ limit: `50mb`, extended: true }));
app.use(bodyParser.json({ limit: `15mb` }));

require("./config/mongodb.js");
router.userAPI(app);

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,accept,access_token,X-Requested-With"
  );
  next();
});

app.all("/", (req, res) => {
  return res.status(200).send("Learning management system is running well.");
});

app.all("*", async (req, res) => {
  return res.status(404).send({
    status: false,
    message: `URL not found.`,
  });
});

//error handler middleware
app.use((err, req, res, next) => {
  //handling mongo validation error
  if (err.name === "SequelizeUniqueConstraintError") {
    console.log("Sequelize Duplication error: ", err);

    return res.status(200).send({
      status: false,
      statusCode: err.status || 400,
      message: `Validation Failed, ${err.errors[0].message}`,
    });
  } else {
    console.log(err);
    return res.status(200).send({
      status: false,
      statusCode: err?.status || 500,
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ` + PORT);
});
