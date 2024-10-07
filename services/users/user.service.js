const userModel = require("./user.model");
const collegesModel = require("../colleges/colleges.model");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const {
  SUPERADMIN,
  STUDENT,
  ADMIN,
  STAFF,
} = require("../../constants/roles.constant");
const JWTSecretKey = process.env.JWT_SECRET_KEY;
const commonFunctions = require("../../helpers/commonFunctions");
const { generateRandomOTP } = require("../../helpers/common.helper");
const { sendMailWithServices } = require("../../helpers/mail.helper");
const batchesModel = require("../batches/batches.model");
const studentsModel = require("../students/student.model");
const staffModel = require("../staff/staff.model");

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
        const collageData = {
          email: "lmscollage@admin.com",
          password: "Admin@123",
          role: ADMIN,
          user_name: "First Collage Admin",
        };

        data.password = await commonFunctions.encode(data.password);
        collageData.password = await commonFunctions.encode(
          collageData.password
        );
        await userModel.updateOne(
          { email: data.email },
          { ...data },
          { upsert: true }
        );
        await userModel.updateOne(
          { email: collageData.email },
          { ...collageData },
          { upsert: true }
        );
        const collageUserResult = await userModel.findOne({
          email: collageData.email,
        });
        const userResult = await userModel.findOne({ email: data.email });

        if (collageUserResult?._id) {
          const collegeData = {
            userId: collageUserResult?._id,
            collegeName: "superAdmin College",
            collegeNo: "-1",
            contactPersonName: "First Admin",
            contactPersonNo: "+919999999999",
            shortName: "superAdmin College",
            isAdmin: true,
          };
          await collegesModel.updateOne(
            { userId: collageUserResult._id },
            { ...collegeData },
            { upsert: true }
          );
          console.log("Creating college for Admin");
        }
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
      await userModel.updateOne({ _id: _id }, { ...data }, { upsert: true });
      return await userModel.findOne(
        { _id: _id },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
    } catch (error) {
      throw error;
    }
  },

  userSignIn: async (email, password) => {
    try {
      let user = await userModel.findOne({ email });
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
      const collegeData = await collegesModel.findOne({ userId: user._id });
      console.log("collegeData: ", collegeData);
      let collegeId = collegeData?._id ? collegeData?._id : null;
      let batchId = null;
      if (!collegeId && user.role === STUDENT) {
        const studentData = await studentsModel.findOne({ userId: user._id });
        batchId = studentData?.batchId ? studentData?.batchId : null;
        const batchData = await batchesModel.findOne({ _id: batchId });
        collegeId = batchData?.collegeId ? batchData?.collegeId : null;
      }
      if (!collegeId && user.role === STAFF) {
        const staffData = await staffModel.findOne({ userId: user._id });
        collegeId = staffData?.collegeUserId ? staffData?.collegeUserId : null;
      }
      const userData = {
        user_id: user._id,
        role: user.role,
        email: user.email,
        permissions: user.permissions,
        college_id: collegeId,
        batch_id: batchId,
      };
      const accessToken = jwt.sign(userData, JWTSecretKey, {
        expiresIn: 86400,
      });
      return { accessToken, user, collegeId, batchId };
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
  forgotPassword: async (email) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw createError(
          404,
          "Email Not Found, Please Try With Registered Email."
        );
      }

      const otp = generateRandomOTP();
      await userModel.updateOne({ email }, { otp });

      const subject = "Forgot Password";
      const body = `Your OTP is ${otp}.`;
      const sendMail = await sendMailWithServices(email, subject, body);
      if (!sendMail) {
        throw createError(500, "Could not send Email.");
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw createError(404, "User not found");
      }

      if (user.otp !== otp) {
        throw createError(401, "Invalid OTP");
      }
      return user._id;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (user_id, password) => {
    try {
      const user = await userModel.findOne({ _id: user_id });
      if (!user) {
        throw createError(404, "User not found");
      }
      password = await commonFunctions.encode(password);
      await userModel.updateOne({ _id: user_id }, { password });
      return true;
    } catch (error) {
      throw error;
    }
  },
};
