const jwt = require("jsonwebtoken");
const isset = require("isset");
const { usersService } = require("../services");
const { SUPERADMIN, ADMIN } = require("../constants/roles.constant");
const JWTSecretKey = process.env.JWT_SECRET_KEY;
module.exports = {
  // =================================== Check admin authentication  ===================================
  isAdminCommonAuthenticate: (req, res, next) => {
    let token = req.headers.authorization;

    jwt.verify(token, JWTSecretKey, async (err, result) => {
      console.log("result :",token, result);
      if (err)
        return res.json({
          status: false,
          message: `Invalid token or expired!`,
          isAuth: false,
        });

      if (result && isset(result.user_id)) {
        const getUserData = await usersService.findUserById(result.user_id);
        console.log("getUserData: ",getUserData)
        if (!getUserData?.length)
          return res.json({
            status: false,
            message: `Invalid token or expired!`,
            isAuth: false,
          });

        if (getUserData[0]?.role === SUPERADMIN || getUserData[0]?.role === ADMIN)
          return res.json({
            status: false,
            message: `Access to the target resource has been denied`,
            isAuth: false,
          });
        req.body.user_id = result.user_id;
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
    jwt.verify(token, JWTSecretKey, async (err, result) => {
      if (err)
        return res.json({
          status: false,
          message: `Something is wrong in Authentication.Please try again.`,
          isAuth: false,
        });
      if (result && isset(result.user_id)) {
        const getUserData = await usersService.findbyAdminEmail(result.email);
        if (!getUserData?.length)
          return res.json({
            status: false,
            message: `Invalid token or expired!`,
            isAuth: false,
          });
        if (getUserData[0]?.role !== SUPERADMIN)
          return res.json({
            status: false,
            message: `Access to the target resource has been denied`,
            isAuth: false,
          });

        req.body.user_id = result.user_id;
        return next();
      }
      return res.json({
        status: false,
        message: `Invalid token or expired!`,
        isAuth: false,
      });
    });
  },
};
