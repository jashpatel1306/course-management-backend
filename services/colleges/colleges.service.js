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
        user_name: data.collegeName,
        permissions: [],
        role: "admin",
      };

      const createUser = await userServices.createUser(userData);

      collegeData.userId = createUser._id;
      console.log("collegeData", collegeData);
      await CollegeModel.updateOne(
        { userId: createUser._id },
        { ...collegeData },
        { upsert: true }
      );
      const college = await CollegeModel.findOne({ userId: createUser._id });
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

  getAllColleges: async (search, pageNo, perPage) => {
    try {
      let filter = {};
      if (search) {
        filter = {
          $or: [
            { collegeName: { $regex: search } },
            { shortName: { $regex: search } },
          ],
        };
      }
      const college = await CollegeModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await CollegeModel.countDocuments();
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
