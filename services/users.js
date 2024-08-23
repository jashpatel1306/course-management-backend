const { userModel } = require("../models");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { SUPERADMIN } = require("../constants/roles.constant");
const JWTSecretKey = process.env.JWT_SECRET_KEY;

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
        const newUser = new userModel({
          email: "lms@admin.com",
          password: "Admin@123",
          role: SUPERADMIN,
          user_name: "First Admin",
        });
        await newUser.save();
      }
    } catch (error) {
      throw error;
    }
  },

  userSignIn: async (email, password) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw createError.Unauthorized("User not found.");
      }

      if (user.password !== password) {
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
};
