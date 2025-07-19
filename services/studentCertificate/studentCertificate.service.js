const studentCertificateModel = require("./studentCertificate.model");
const templateCertificateModel = require("../templateCertificate/templateCertificate.model");
const { mongoose } = require("mongoose");

module.exports = {
  createStudentCertificate: async (data) => {
    const existing = await studentCertificateModel.findOne({
      userId: data.userId,
      courseId: data.courseId
    });

    if (existing)
      throw new Error("User already has a certificate for this course");

    return await studentCertificateModel.create(data);
  },
  changesCertificateVisibility: async (
    certificateId,
    collegeId,
    certificateStatus
  ) => {
    const template = await templateCertificateModel.findOne({
      collegeId: collegeId
    });
    if (template) {
      const fullData = {
        certificateStatus: certificateStatus,
        companyLogo1: template.companyLogo1,
        companyLogo2: template.companyLogo2,
        signature1: template.signature1,
        signatory1Name: template.signatory1Name,
        signatory1Title: template.signatory1Title,
        signature2: template.signature2,
        signatory2Name: template.signatory2Name,
        signatory2Title: template.signatory2Title
      };

      return await studentCertificateModel.updateOne(
        { _id: certificateId },
        { fullData }
      );
    } else {
      const templateDefault = await templateCertificateModel.findOne({
        type: "DEFAULT"
      });
      const fullData = {
        certificateStatus: certificateStatus,
        companyLogo1: templateDefault.companyLogo1,
        companyLogo2: templateDefault.companyLogo2,
        signature1: templateDefault.signature1,
        signatory1Name: templateDefault.signatory1Name,
        signatory1Title: templateDefault.signatory1Title,
        signature2: templateDefault.signature2,
        signatory2Name: templateDefault.signatory2Name,
        signatory2Title: templateDefault.signatory2Title
      };

      return await studentCertificateModel.updateOne(
        { _id: certificateId },
        { fullData }
      );
    }
  },

  getAllStudentCertificates: async () => {
    return await studentCertificateModel
      .find()
      .populate("userId")
      .populate("courseId");
  },

  getStudentCertificateById: async (id) => {
    return await studentCertificateModel
      .findById(id)
      .populate("userId")
      .populate("courseId");
  },

  updateStudentCertificateStatus: async (id, status) => {
    return await studentCertificateModel.findByIdAndUpdate(
      id,
      { certificateStatus: status },
      { new: true }
    );
  },

  deleteStudentCertificate: async (id) => {
    return await studentCertificateModel.findByIdAndDelete(id);
  },
  getAllCertificates: async ({
    collegeId,
    batchId,
    courseId,
    pageNo = 1,
    perPage = 10
  }) => {
    try {
      const page = parseInt(pageNo, 10);
      const limit = parseInt(perPage, 10);
      const skip = (page - 1) * limit;

      // Build the match criteria dynamically
      const matchStage = {
        ...(collegeId && { collegeId: new mongoose.Types.ObjectId(collegeId) }),
        ...(batchId && { batchId: new mongoose.Types.ObjectId(batchId) }),
        ...(courseId && { courseId: new mongoose.Types.ObjectId(courseId) })
      };

      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: "colleges",
            let: { collegeId: "$collegeId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$collegeId"] }
                }
              },
              {
                $project: {
                  collegeName: 1
                }
              }
            ],
            as: "collegeData"
          }
        },
        {
          $lookup: {
            from: "courses",
            let: { courseId: "$courseId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$courseId"] }
                }
              },
              {
                $project: {
                  courseName: 1
                }
              }
            ],
            as: "courseData"
          }
        },
        {
          $lookup: {
            from: "batches",
            let: { batchId: "$batchId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$batchId"] }
                }
              },
              {
                $project: {
                  batchName: 1
                }
              }
            ],
            as: "batchData"
          }
        },
        {
          $project: {
            userId: 1,
            studentName: 1,
            courseName: 1,
            courseId: 1,
            collegeId: 1,
            batchId: 1,
            certificateStatus: 1,
            certificationNumber: 1,
            collegeName: { $arrayElemAt: ["$collegeData.collegeName", 0] },
            batchName: { $arrayElemAt: ["$batchData.batchName", 0] },
            courseName: { $arrayElemAt: ["$courseData.courseName", 0] }
          }
        },
        { $skip: skip },
        { $limit: limit }
      ];

      const [result, countResult] = await Promise.all([
        studentCertificateModel.aggregate(pipeline),
        studentCertificateModel.aggregate([
          { $match: matchStage },
          { $count: "total" }
        ])
      ]);

      return {
        result,
        count: countResult[0]?.total || 0
      };
    } catch (error) {
      console.error("Error fetching certificates:", error);
      throw error;
    }
  }
};
