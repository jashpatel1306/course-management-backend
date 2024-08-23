const userModel = require("./user.model");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { SUPERADMIN } = require("../../constants/roles.constant");
const JWTSecretKey = process.env.JWT_SECRET_KEY;
const commonFunctions = require("../../helpers/commonFunctions");

module.exports = {
  getUserByEmail: async function (email) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw createError(404, "User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  },
  addDefaultAdmin: async () => {
    try {
      const user = await userModel.findOne({ role: SUPERADMIN });
      if (!user) {
        const data = {
          email: "lms@admin.com",
          password: "Admin@123",
          role: SUPERADMIN,
          user_name: "First Admin",
        };
        data.password = await commonFunctions.encode(data.password);
        await userModel.updateOne(
          { email: data.email },
          { ...data },
          { upsert: true }
        );
      }
    } catch (error) {
      throw error;
    }
  },
  createUser: async (data) => {
    try {
      if (data.password) {
        data.password = await commonFunctions.encode(data.password);
      }
      await userModel.updateOne(
        { email: data.email },
        { ...data },
        { upsert: true }
      );
      return await userModel.findOne(
        { email: data.email },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (_id, data) => {
    try {
      if (data.password) {
        data.password = await commonFunctions.encode(data.password);
      }
      await userModel.updateOne({ _id }, { ...data }, { upsert: true });
      return await userModel.findOne(
        { _id: data.user_id },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
    } catch (error) {
      throw error;
    }
  },

  userSignIn: async (email, password) => {
    try {
      const user = await userModel.findOne({ email });
      console.log("user: ", email,password);
      if (!user) {
        throw createError.Unauthorized(
          "There is no account associated with this email address. Please try again."
        );
      }
      if (!user.active) {
        throw createError.Unauthorized(
          "Your account has been blocked by the main admin. Please contact the main admin for further assistance."
        );
      }
      const dbPassword = await commonFunctions.decode(user.password);
      if (dbPassword !== password) {
        throw createError.Unauthorized("Invalid password.");
      }

      const userData = {
        user_id: user._id,
        role: user.role,
        email: user.email,
        permissions: user.permissions,
      };

      const accessToken = jwt.sign(userData, JWTSecretKey, {
        expiresIn: 86400,
      });
      return { accessToken, user };
    } catch (error) {
      throw error;
    }
  },
  findUserById: async (userId) => {
    try {
      const user = await userModel.findOne({ _id: userId });
      if (!user) {
        throw createError(404, "User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  },
  resetPasswordUpdate: async (_id, password) => {
    try {
      const user = await userModel.findOne({ _id });
      if (!user) {
        throw createError(404, "User not found");
      }
      password = await commonFunctions.encode(password);
      await userModel.updateOne({ _id }, { password });
      return await userModel.findOne(
        { _id },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
    } catch (error) {
      console.log("resetPasswordUpdate service error  : ", error);
      throw error;
    }
  },
};
