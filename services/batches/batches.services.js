const { default: mongoose } = require("mongoose");
const BatchModel = require("./batches.model");
const createError = require("http-errors");
const CollegeModel = require("../colleges/colleges.model");
const studentsModel = require("../students/student.model");
const batchesModel = require("./batches.model");
const CourseModel = require("../courses/course");
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
      const batch = await BatchModel.findOne({ _id: id }).populate(
        "instructorIds",
        "_id name"
      ).populate("courses","_id courseName");
      if (!batch) createError.BadRequest("Invalid batch id.");
      return batch;
    } catch (error) {
      throw error;
    }
  },

  getBatchByCollegeIdAndName: async (collegeId, batchName) => {
    try {
      const batchId = await BatchModel.findOne(
        { collegeId, batchName },
        { _id: 1 }
      ).populate("instructorIds", "_id name");
      if (!batchId) createError.BadRequest("Invalid batch name .");
      return batchId;
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
        .populate("instructorIds", "_id name")
        .sort({ batchName: 1 })
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
      const filter = collegeId ? { collegeId } : {};
      const batches = await BatchModel.find(filter)
        .populate("instructorIds", "_id name")
        .populate("courses", "_id courseName")
        .populate("collegeId", "_id collegeName")
        .sort({ batchName: 1 });

      if (!batches) {
        throw createError(404, "Batches not found");
      }

      // Add total number of students for each batch
      const batchesWithStudentCount = await Promise.all(
        batches.map(async (batch) => {
          const studentCount = await studentsModel.countDocuments({
            batchId: batch._id,
          });
          return { ...batch.toObject(), studentCount };
        })
      );

      return batchesWithStudentCount;
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
  getKeyValueBatches: async (collegeId, adminStatus) => {
    try {
      let batches = await BatchModel.aggregate([
        {
          $match: { collegeId: new ObjectId(collegeId) },
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
            batchNumber: "$batchNumber",
            label: "$batchName", // Renaming field to 'label'
            value: "$_id", // Renaming field to 'value'
            totalStudents: { $size: "$studentsData" }, // Counting students in each batch
            labelAndTotal: {
              $concat: [
                "$batchName", // The label
                " (", // Separator (you can customize this)
                { $toString: { $size: "$studentsData" } }, // Convert totalStudents to string
                ")",
              ],
            },
          },
        },
      ]);
      // if (!adminStatus) {
        // let allBatchesStudentsCount = await studentsModel.countDocuments({
        //   collegeUserId: new ObjectId(collegeId),
        // });
        batches.unshift({
          label: "All Batches",
          value: "all",
          // totalStudents: allBatchesStudentsCount,
        });
      // }

      return batches;
    } catch (error) {
      throw error;
    }
  },
  getCoursesByBatchId: async (batchId) => {
    try {
      const batchData = await BatchModel.findOne({ _id: batchId });
      if (!batchData) {
        throw createError(404, "Batches not found");
      }
      const courseIds = batchData.courses;
      const courses = await CourseModel.find({ _id: { $in: courseIds } });
      if (!courses) {
        throw createError.NotFound("No courses found for the given college.");
      }

      return { courses };
    } catch (error) {
      throw createError(error);
    }
  },
  getCourseOptionsByBatch: async (batchId) => {
    try {
     
      const batchData = await BatchModel.findOne({ _id: batchId }).populate(
        "courses",
        "_id courseName"
      );
      const data = batchData.courses.map((item) => {
        return { label: item.courseName, value: item._id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
};
