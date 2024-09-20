const batchesModel = require("../batches/batches.model");
const CourseModel = require("./course"); // Adjust the path as needed
const createError = require("http-errors");

module.exports = {
  createCourse: async (data) => {
    try {
      const course = await CourseModel.create(data);
      if (!course) {
        throw createError.InternalServerError("Error while creating course.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  getCourseById: async (id) => {
    try {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  updateCourse: async (id, data) => {
    try {
      const course = await CourseModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!course) {
        throw createError.NotFound("Course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  deleteCourse: async (id) => {
    try {
      const course = await CourseModel.findByIdAndDelete(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }
      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  getCoursesByCollegeId: async (collegeId, search, pageNo, perPage) => {
    try {
      let filter = {
        $or: [{ collegeId: collegeId }, { collegeIds: { $in: [collegeId] } }],
      };
      if (search) {
        filter = {
          $and: [
            {
              $or: [
                { collegeId: collegeId },
                { collegeIds: { $in: [collegeId] } },
              ],
            },
            {
              $or: [
                { courseName: { $regex: search, $options: "i" } },
                { courseDescription: { $regex: search, $options: "i" } },
              ],
            },
          ],
        };
      }

      const courses = await CourseModel.find(filter)
        .skip((pageNo - 1) * perPage)
        .limit(perPage);

      const count = await CourseModel.countDocuments(filter);

      if (!courses) {
        throw createError.NotFound("No courses found for the given college.");
      }

      return { courses, count };
    } catch (error) {
      throw createError(error);
    }
  },
  toggleCourseStatus: async (id) => {
    try {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }

      course.active = !course.active;
      await course.save();

      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  toggleCoursePublishStatus: async (id) => {
    try {
      const course = await CourseModel.findById(id);
      if (!course) {
        throw createError.NotFound("Course not found.");
      }

      course.isPublish = !course.isPublish;
      await course.save();

      return course;
    } catch (error) {
      throw createError(error);
    }
  },
  getPublishCourses: async () => {
    try {
      const publishCourses = await CourseModel.find({ isPublish: true });
      if (!publishCourses || publishCourses.length === 0) {
        throw createError.NotFound("No publish courses found.");
      }
      return publishCourses;
    } catch (error) {
      throw createError(error);
    }
  },
  getCourseOptions: async (collegeId) => {
    try {
      const courses = await CourseModel.find({
        $and: [
          {
            $or: [
              { collegeId: collegeId },
              { collegeIds: { $in: [collegeId] } },
            ],
          },
          { isPublish: true },
        ],
      });
      const data = courses.map((item) => {
        return { label: item.courseName, value: item._id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },

  addAssignCourse: async (batchId, collegeId, courseId) => {
    try {
      // Check if the course exists
      const course = await CourseModel.findById(courseId);

      if (!course) {
        throw new Error("Course not found.");
      }

      // Check if collegeId is already in collegeIds and add it if not
      if (!course.collegeIds.includes(collegeId)) {
        await CourseModel.updateOne(
          { _id: courseId },
          { $addToSet: { collegeIds: collegeId } }
        );
      }

      // Find the batch
      const batch = await batchesModel.findOne({
        _id: batchId,
        collegeId: collegeId,
      });

      if (!batch) {
        throw new Error("Batch not found or college ID does not match.");
      }

      // Check if courseId is already in the batch's courses
      if (batch.courses.includes(courseId)) {
        return { message: "Course ID already exists in the batch." };
      }

      // Add courseId to the batch's courses array
      await batchesModel.updateOne(
        { _id: batchId },
        { $addToSet: { courses: courseId } }
      );

      return {
        message:
          "Course ID added to batch and college ID updated in course successfully.",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addAssignCourseCollege: async (collegeId, courseId) => {
    try {
      // Check if the course exists
      const course = await CourseModel.findById(courseId);

      if (!course) {
        throw new Error("Course not found.");
      }

      // Check if collegeId is already in collegeIds and add it if not
      if (!course.collegeIds.includes(collegeId)) {
        await CourseModel.updateOne(
          { _id: courseId },
          { $addToSet: { collegeIds: collegeId } }
        );
      }

      return {
        message: "Course ID added to college updated in course successfully.",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getCourseSectionOptionsByCourseId: async (courseId) => {
    try {
      const coursesData = await CourseModel.findOne({ _id: courseId });
      const data = coursesData.sections.map((item) => {
        return { label: item.name, value: item.id };
      });
      return data;
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  getCourseDataById: async (id) => {
    try {
      // Fetch courses where isPublish is true
      const courses = await CourseModel.find({ isPublish: true })
        .populate({
          path: "sections.id", // Populate sections inside the course
          match: { isPublish: true }, // Only fetch sections where isPublish is true
          select: "name lecturesCount lectures", // Only select relevant fields from sections
          populate: {
            path: "lectures.id", // Populate lectures inside each section
            match: { isPublish: true }, // Only fetch lectures where isPublish is true
            select: "name lectureContent publishDate", // Only select relevant fields from lectures
          },
        })
        .lean(); // lean() gives you plain JS objects instead of Mongoose documents

      if (!courses || courses.length === 0) {
        return "No published courses found.";
      }

      return courses.map((course) => ({
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        coverImage: course.coverImage,
        totalSections: course.totalSections,
        totalLectures: course.totalLectures,
        sections: course.sections.map((section) => ({
          name: section.name,
          lecturesCount: section.lecturesCount,
          lectures: section.lectures.map((lecture) => ({
            name: lecture.name,
            lectureContent: lecture.lectureContent,
            publishDate: lecture.publishDate,
          })),
        })),
        publishDate: course.publishDate,
      }));
    } catch (error) {
      console.error("Error fetching published course data:", error);
      throw error;
    }
  },
};
