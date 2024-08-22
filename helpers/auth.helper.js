const JWTSecretKey = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
const isset = require("isset");
const { getUserByEmail } = require("../services/users.services");
const createError = require("http-errors");
// const { userServices } = require("../services/user.services");
// const { getAdminByEmail } = require("../services/admin.services");

//======================================= sign Access Token =======================================//
/**
 * change the issuer,time and other params as required to generate jwt access token
 */
(module.exports.signAccessToken = (
  userId,
  userRole,
  email,
  permissions,
  time
) => {
  return new Promise((resolve, reject) => {
    const payload = { userId, email, userRole, permissions };
    const secret = process.env.JWT_SECRET_KEY;
    const options = {
      expiresIn: time,
      issuer: "learning-management-platform",
      audience: [userId],
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}),
  //========================================== Verify JWT ========================================//

  /**
   * pass the token and verify the authenticity of it
   * access the details from the token like userId, role and email and
    use it wherever needed without worrying about getting it from frontend
   */
  (module.exports.verifyJWTToken = (token) => {
    return new Promise((resolve) => {
      jwt.verify(token, JWTSecretKey, async (err, result) => {
        if (err) {
          return resolve({
            success: false,
            message: "AccessToken has Expired!",
          });
        }
        if (result) return resolve({ success: true, data: result.id });
        // console.log("AccessToken");
        return resolve({
          success: false,
          message: "Invalid token or expired!",
        });
      });
    });
  });

// =================================== Check user authentication ===================================

/**
 * role based access controller middleware to use directly in the routes for role based access control for user only
 * in return you can use res.locals.userId, res.locals.userRole, res.locals.userEmail 
   in main controllers for further use refer to implant-docz or other projects
 *
 */
module.exports.isUserAuthentic = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("token", token);
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Authorization Token is required.",
        isAuth: false,
        data: [],
      });
    token = token?.split(" ");
    token = token[1];

    jwt.verify(token, JWTSecretKey, async (err, result) => {
      if (err) {
        console.log("error", err);

        return res.status(401).json({
          success: false,
          message: "Something is wrong in Authentication.Please try again.",
          isAuth: false,
          data: [],
        });
      }
      console.log("result", result);
      const userEmail = result.email;
      const userData = await getUserByEmail(userEmail);

      if (!userData)
        return next(createError.Unauthorized("You are not authorized!"));

      if (result && isset(result.userId)) {
        res.locals.userId = result.userId;
        res.locals.userRole = result.userRole;
        res.locals.userEmail = result.email;
        return next();
      }
      return next(createError.Unauthorized("Invalid Token or Expired!"));
    });

    // // if (result && isset(result.userId)) {
    // //   res.locals.userId = result.userId;
    // //   res.locals.userRole = result.userRole;
    // //   res.locals.userEmail = result.email;
    // //   return next();
    // // }
    // return res.status(401).json({
    //   success: false,
    //   message: "You are not authorized! abv",
    //   isAuth: false,
    //   data: [],
    // });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "You are not authorized!",
      isAuth: false,
      data: [],
    });
  }
};

// =================================== Check admin authentication  ===================================

/**
 * role based access controller middleware to use directly in the routes for role based access control for Admins only
 * in return you can set parameters in res.locals for different use-cases
   in main controllers for further without fetching it from frontend p.s.: refer to implant-docz or other projects for more understanding
 *
 */

module.exports.isAdminAuthentic = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token)
    return next(createError.Unauthorized("Authorization Token is required."));

  token = token.split(" ");
  token = token[1];
  // console.log("token", token);
  jwt.verify(token, JWTSecretKey, async (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        status: 401,
        message: "Invalid token or expired! " + err.message,
        isAuth: false,
        data: [],
      });
    }
    // console.log(result);
    if (result && isset(result.userId)) {
      const getAdminData = await getUserByEmail(result.email);
      // console.log("getAdminData : ",getAdminData)
      if (!getAdminData)
        return res.json({
          success: false,
          status: 401,
          message: "Invalid token or expired! ",
          isAuth: false,
          data: [],
        });

      return next();
    }
    return res.json({
      success: false,
      status: 401,
      message: "Invalid token or expired! ",
      isAuth: false,
      data: [],
    });
  });
};
