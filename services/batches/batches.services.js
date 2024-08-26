const { default: mongoose } = require("mongoose");
const studentsModel = require("../students/students.model");
const batchesModel = require("./batches.model");
const BatchModel = require("./batches.model");
const createError = require("http-errors");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  createBatch: async (data) => {
    try {
      const batch = await BatchModel.create(data);
      if (!batch) createError(500, "Error while creating batch");
      return batch;
    } catch (error) {
      throw error;
    }
  },
  updateBatch: async (id, data) => {
    try {
      const batch = await BatchModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (!batch) createError(500, "Error while updating batch");
      return batch;
    } catch (error) {
      throw error;
    }
  },
  getBatchById: async (id) => {
    try {
      const batch = await BatchModel.findOne({ _id: id });
      if (!batch) createError.BadRequest("Invalid batch id.");
      return batch;
    } catch (error) {
      throw error;
    }
  },
  getAllBatches: async (search, pageNo, perPage) => {
    try {
      let filter = {};

      if (search) {
        filter = {
          $or: [{ batchName: { $regex: search } }],
        };
      }

      const batch = await BatchModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await BatchModel.countDocuments();

      if (!batch) {
        throw createError(404, "Batches not found");
      }

      return { batch, count };
    } catch (error) {
      throw error;
    }
  },
  getAllBatchesByCollegeId: async (collegeId) => {
    try {
      const batch = await BatchModel.find({ collegeId });
      if (!batch) {
        throw createError(404, "Batches not found");
      }

      return batch;
    } catch (error) {
      throw error;
    }
  },

  deleteBatch: async (id) => {
    try {
      const batch = await BatchModel.findOneAndDelete({ _id: id });
      if (!batch) throw createError(404, "Batches not found");

      return batch;
    } catch (error) {
      throw error;
    }
  },

  activeStatusChange: async (id) => {
    try {
      const batch = await BatchModel.findOne({ _id: id });
      if (!batch) createError(500, "Error while updating batch");
      batch.active = !batch.active;
      await batch.save();
      return batch;
    } catch (error) {
      throw error;
    }
  },
  getKeyValueBatches: async (collegeId) => {
    try {
      let batches = await BatchModel.aggregate([
        {
          $match: { collegeId:new ObjectId(collegeId) },
        },
        {
          $lookup: {
            from: "students", // Referencing the students collection
            localField: "_id", // Field from the batches collection
            foreignField: "batchId", // Field from the students collection
            as: "studentsData", // Alias for the joined data
          },
        },
        {
          $project: {
            label: "$batchName", // Renaming field to 'label'
            value: "$_id", // Renaming field to 'value'
            totalStudents: { $size: "$studentsData" }, // Counting students in each batch
          },
        },
      ]);
      console.log("batches : ", collegeId, batches);
      return batches;
    } catch (error) {
      throw error;
    }
  },
};
