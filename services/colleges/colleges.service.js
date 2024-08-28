const CollegeModel = require("./colleges.model");
const createError = require("http-errors");
const userServices = require("../users/user.service");
module.exports = {
    createCollege: async (data) => {
    try {
      const { email, password, ...collegeData } = data;
      const userData = {
        email: data.email,
        password: data.password,
        user_name: data.contactPersonName,
        permissions: [],
        role: "admin",
      };
      let userResult;
      if (data.userId) {
        userResult = await userServices.updateUser(data.userId, userData);
      } else {
        userResult = await userServices.createUser(userData);
      }
      collegeData.userId = userResult._id;
      await CollegeModel.updateOne(
        { userId: userResult._id },
        { ...collegeData },
        { upsert: true }
      );
      const college = await CollegeModel.findOne({ userId: userResult._id });
      return college;
    } catch (error) {
      throw error;
    }
  },

  getOneCollegeById: async (id) => {
    try {
      const college = await CollegeModel.findById(id);
      if (!college) {
        throw createError(404, "College not found");
      }
      return college;
    } catch (error) {
      throw error;
    }
  },

  getAllColleges: async (searchText, pageNo, perPage, status) => {
    try {
      let filter = {};

      const tabData =
        status === `0`
          ? { active: false, isAdmin: false }
          : status === `1`
          ? { active: true, isAdmin: false }
          : { isAdmin: false };
      filter = {
        $and: [
          tabData,
          {
            $or: [
              { collegeName: { $regex: searchText } },
              { shortName: { $regex: searchText } },
              { collegeNo: { $regex: searchText } },
              { contactPersonName: { $regex: searchText } },
              { contactPersonNo: { $regex: searchText } },
            ],
          },
        ],
      };

      const college = await CollegeModel.find(filter)
        .populate("userId", "email password ")
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await CollegeModel.countDocuments(filter);
      if (!college) {
        throw createError(404, "Colleges not found");
      }
      return { college, count };
    } catch (error) {
      throw error;
    }
  },
  activeStatusChange: async (id) => {
    try {
      const college = await CollegeModel.findOne({ _id: id });

      if (!college) {
        throw createError(404, "College not found");
      }
      college.active = !college.active;
      await college.save();

      return college;
    } catch (error) {
      throw error;
    }
  },
};
