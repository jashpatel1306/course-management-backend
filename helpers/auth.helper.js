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
  //=================================== Check  authentication ===================================
  isAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;
    token = token.toLowerCase().includes("bearer")
      ? token.split(" ")[1]
      : token;
    try {
      jwt.verify(token, JWTSecretKey, async (err, result) => {
        if (err)
          return res.status(401).json({
            status: false,
            message: `Invalid token or expired!`,
            isAuth: false,
          });

        if (result && isset(result.user_id)) {
          const getUserData = await userServices.findUserById(result.user_id);
          if (!getUserData)
            return res.status(401).json({
              status: false,
              message: `Invalid token or expired!`,
              isAuth: false,
            });
          req.body.user_id = result.user_id;
          req.body.college_id = result.college_id;

          res.locals.userRole = result.role;
          return next();
        }
        return res.status(401).json({
          status: false,
          message: `Invalid token or expired!`,
          isAuth: false,
        });
      });
    } catch (error) {
      console.log("Error in authentication", error);
      next(error);
    }
  },
  isAdminCommonAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;
    token = token.toLowerCase().includes("bearer")
      ? token.split(" ")[1]
      : token;
    try {
      jwt.verify(token, JWTSecretKey, async (err, result) => {
        if (err) {
          console.log("jwt error", err);
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

          if ([INSTRUCTOR, STUDENT].includes(getUserData?.role))
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
          res.locals.userRole = result.role;

          return next();
        }
        return res.json({
          status: false,
          message: `Invalid token or expired!`,
          isAuth: false,
        });
      });
    } catch (error) {
      next(error);
    }
  },
  // =================================== Check super admin authentication  ===================================
  isSuperAdminAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;
    token = token.toLowerCase().includes("bearer")
      ? token.split(" ")[1]
      : token;
    try {
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
            res.locals.userRole = SUPERADMIN;
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
    } catch (error) {
      console.log("Error in super admin authentication", error);
      next(error);
    }
  },
  isStudentAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;
    token = token.toLowerCase().includes("bearer")
      ? token.split(" ")[1]
      : token;
    jwt.verify(token, JWTSecretKey, async (err, result) => {
      if (err)
        return res.status(401).json({
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
        if (getUserData.role === STUDENT) {
          req.body.user_id = result.user_id;
          req.body.college_id = result.college_id;
          req.body.batch_id = result.batch_id;
          res.locals.userRole = STUDENT;

          return next();
        } else {
          return res.status(401).json({
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
  isInstructorAuthenticate: (req, res, next) => {
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
        if (getUserData.role === INSTRUCTOR) {
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
};
