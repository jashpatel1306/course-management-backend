const staffModel = require("./staff.model");
const createError = require("http-errors");

module.exports = {
  createStaff: async (data) => {
    try {
      data.permissions = data.permissions.map((permission) => permission.value);
      const staff = await staffModel.create(data);
      if (!staff) throw createError(500, "Error while creating staff");
      return staff;
    } catch (error) {
      throw createError(error);
    }
  },

  createStaffInBulk: async (data) => {
    try {
      const staff = await staffModel.insertMany(data);
      if (!staff) throw createError(500, "Error while creating staff in bulk");
      return staff;
    } catch (error) {
      throw createError(error);
    }
  },

  getStaffById: async (id) => {
    try {
      const staff = await staffModel.findOne({ _id: id });
      if (!staff) throw createError(500, "Error while retrieving staff");
      return staff;
    } catch (error) {
      throw createError(error);
    }
  },

  updateStaff: async (id, data) => {
    try {
      const staff = await staffModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (!staff) throw createError(500, "Error while updating staff");
      return staff;
    } catch (error) {
      throw createError(error);
    }
  },

  deleteStaff: async (id) => {
    try {
      const staff = await staffModel.findOneAndDelete({ _id: id });
      if (!staff) throw createError(500, "Error while deleting staff");
      return staff;
    } catch (error) {
      throw createError(error);
    }
  },

  getAllStaff: async (search, pageNo, perPage) => {
    try {
      let filter = {};
      if (search) {
        filter = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        };
      }

      const staff = await staffModel
        .find(filter)
        .sort({ name: 1 })
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await staffModel.countDocuments(filter);
      if (!staff) throw createError(404, "Staff not found");

      return { staff, count };
    } catch (error) {
      throw createError(error);
    }
  },

  statusChange: async (id) => {
    try {
      const staff = await staffModel.findOne({ _id: id });
      if (!staff) throw createError(400, "Invalid staff ID");
      staff.active = !staff.active;
      await staff.save();
      return staff;
    } catch (error) {
      throw createError(error);
    }
  },

  getCollegeWiseStaff: async (search, perPage, pageNo, collegeUserId) => {
    try {
      const filter = {
        $and: [
          collegeUserId ? { collegeUserId } : {},
          {
            $or: [{ name: { $regex: search } }, { email: { $regex: search } }],
          },
        ],
      };
      const staff = await staffModel
        .find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);
      const count = await staffModel.countDocuments(filter);
      if (!staff) throw createError(404, "Staff not found");

      return { staff, count };
    } catch (error) {
      throw createError(error);
    }
  },
};
