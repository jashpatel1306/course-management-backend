const { userModel } = require("../models");
const createError = require("http-errors");
const { signAccessToken } = require("../helpers/auth.helper");

module.exports = {
  getUserByEmail: async function (email){
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
      const user = await userModel.findOne({ role: "admin" });
      if (!user) {
        const newUser = new userModel({
          email: "learning_management@admmin.com",
          password: "Admin@123",
          role: "admin",
          name: "Admin 1",
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
      const TIME = "30d";

      const accessToken = await signAccessToken(
        user._id,
        user.role,
        user.email,
        user.permissions,
        TIME
      );
      return { accessToken, user };
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (userId) => {
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
