const jwt = require("jsonwebtoken");
const isset = require("isset");
const {
  ADMIN,
  INSTRUCTOR,
  SUPERADMIN,
  STUDENT,
  STAFF,
} = require("../constants/roles.constant");
const { userServices } = require("../services");
const JWTSecretKey = process.env.JWT_SECRET_KEY;
module.exports = {
  // =================================== Check  authentication  ===================================
  isAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;
    token = token.toLowerCase().includes("bearer")
      ? token.split(" ")[1]
      : token;
    jwt.verify(token, JWTSecretKey, async (err, result) => {
      if (err)
        return res.json({
          status: false,
          message: `Invalid token or expired!`,
          isAuth: false,
        });

      if (result && isset(result.user_id)) {
        const getUserData = await userServices.findUserById(result.user_id);
        if (!getUserData)
          return res.json({
            status: false,
            message: `Invalid token or expired!`,
            isAuth: false,
          });
        req.body.user_id = result.user_id;
        req.body.college_id = result.college_id;
        return next();
      }
      return res.json({
        status: false,
        message: `Invalid token or expired!`,
        isAuth: false,
      });
    });
  },
  isAdminCommonAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;
    token = token.toLowerCase().includes("bearer")
      ? token.split(" ")[1]
      : token;
    jwt.verify(token, JWTSecretKey, async (err, result) => {
      if (err) {
        console.log("err1", err);
        return res.json({
          status: false,
          message: `Invalid token or expired!`,
          isAuth: false,
        });
      }

      if (result && isset(result.user_id)) {
        const getUserData = await userServices.findUserById(result.user_id);
        if (!getUserData)
          return res.json({
            status: false,
            message: `Invalid token or expired!`,
            isAuth: false,
          });

        if ([INSTRUCTOR, STUDENT, STAFF].includes(getUserData?.role))
          return res.json({
            status: false,
            message: `Access to the target resource has been denied`,
            isAuth: false,
          });
        req.body = {
          ...req.body,
          user_id: result.user_id,
          college_id: result.college_id,
        };

        return next();
      }
      return res.json({
        status: false,
        message: `Invalid token or expired!`,
        isAuth: false,
      });
    });
  },
  // =================================== Check super admin authentication  ===================================
  isSuperAdminAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;
    token = token.toLowerCase().includes("bearer")
      ? token.split(" ")[1]
      : token;
    jwt.verify(token, JWTSecretKey, async (err, result) => {
      if (err)
        return res.json({
          status: false,
          message: `Something is wrong in Authentication.Please try again.`,
          isAuth: false,
        });

      if (result && isset(result.user_id)) {
        const getUserData = await userServices.findUserById(result.user_id);
        if (!getUserData)
          return res.json({
            status: false,
            message: `Invalid token or expired!`,
            isAuth: false,
          });
        if (getUserData.role === SUPERADMIN) {
          req.body.user_id = result.user_id;
          req.body.college_id = result.college_id;
          return next();
        } else {
          return res.json({
            status: false,
            message: `Access to the target resource has been denied`,
            isAuth: false,
          });
        }
      }
      return res.json({
        status: false,
        message: `Invalid token or expired!`,
        isAuth: false,
      });
    });
  },
  isStudentAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;
    token = token.toLowerCase().includes("bearer")
      ? token.split(" ")[1]
      : token;
    jwt.verify(token, JWTSecretKey, async (err, result) => {
      if (err)
        return res.json({
          status: false,
          message: `Something is wrong in Authentication.Please try again.`,
          isAuth: false,
        });
      if (result && isset(result.user_id)) {
        const getUserData = await userServices.findUserById(result.user_id);
        if (!getUserData)
          return res.json({
            status: false,
            message: `Invalid token or expired!`,
            isAuth: false,
          });
        console.log("getUserData :", getUserData);
        if (getUserData.role === STUDENT) {
          console.log("req.body :", result);
          req.body.user_id = result.user_id;
          req.body.college_id = result.college_id;
          req.body.batch_id = result.batch_id;
          return next();
        } else {
          return res.json({
            status: false,
            message: `Access to the target resource has been denied`,
            isAuth: false,
          });
        }
      }
      return res.json({
        status: false,
        message: `Invalid token or expired!`,
        isAuth: false,
      });
    });
  },
};
