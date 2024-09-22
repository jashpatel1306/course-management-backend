const assignAssessmentServices = require("../assignAssessment/assignAssessment.services");
const batchesModel = require("../batches/batches.model");
const lecturesServices = require("../lectures/lectures.services");
const CourseModel = require("./course"); // Adjust the path as needed
const createError = require("http-errors");
const getPreAssessmentDataByType = (assessmentData, positionType = "pre") => {
  const result = assessmentData.filter(
    (assessment) => assessment.positionType === positionType
  );
  console.log("result :", result);
  if (result.length >= 1) {
    // check if the assessment is submitted or not?
    return {
      type: "assessment",
      id: result[0].assessmentId._id,
      title: result[0].assessmentId.title,
      status: false,
    };
  } else {
    return null;
  }
};
const getSectionAssessmentDataByType = (
  assessmentData,
  lectureId,
  sectionIndex,
  lectureIndex,
  positionType = "section"
) => {
  const result = assessmentData.filter((assessment) => {
    // Check if positionType matches
    const positionMatches = assessment.positionType === positionType;

    // Check if lectureId matches, accounting for ObjectId and null values
    const lectureIdMatches =
      lectureId === null ||
      (assessment.lectureId &&
        assessment.lectureId.equals &&
        assessment.lectureId.equals(lectureId));

    return positionMatches && lectureIdMatches;
  });

  // Return the assessment data or null
  if (result.length >= 1) {
    return {
      type: "assessment",
      id: result[0].assessmentId._id,
      title: result[0].assessmentId.title,
      sectionIndex: sectionIndex,
      lectureIndex: lectureIndex,
      status: false, // Change the logic here if needed for assessment submission
    };
  } else {
    return null;
  }
};
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
  getCourseSidebarDataById: async (batchId, courseId) => {
    try {
      // Fetch published course by ID
      const course = await CourseModel.findOne({
        _id: courseId,
        isPublish: true,
      }).populate("sections.id", "_id name lectures");

      if (!course) {
        return "No published courses found.";
      }

      console.log("batchId : ", batchId);

      // Fetch assessment data based on batch and course IDs
      const assessmentData =
        await assignAssessmentServices.getAssessmentByBatchIdAndCourseId(
          courseId,
          batchId
        );

      const sidebarData = [];
      const contentData = [];

      // Check for pre-assessment data and add to sidebar and content
      const preAssessment = getPreAssessmentDataByType(assessmentData);
      if (preAssessment) {
        sidebarData.push(preAssessment);
        contentData.push(preAssessment);
      }

      // Process sections if they exist
      if (course?.sections.length) {
        const finalSectionData = await Promise.all(
          course.sections.map(async (info, index) => {
            const section = info.id; // Create a shallow copy to avoid mutation
            console.log("section.name before: ", section.name);

            const sectionLectureContent = [];

            // Fetch and process lectures for this section
            const lectureContent = await Promise.all(
              section.lectures.map(async (lecture, lectureIndex) => {
                try {
                  const lectureData =
                    await lecturesServices.getPublishLectureDataById(
                      lecture.id
                    );

                  if (!lectureData) {
                    console.warn(`No data found for lecture ID: ${lecture.id}`);
                    return null; // Handle missing lecture data
                  }

                  const sectionAssessment = getSectionAssessmentDataByType(
                    assessmentData,
                    lecture.id,
                    index,
                    lectureIndex
                  );

                  const contentData = lectureData.lectureContent.map(
                    (item) => ({
                      type: "content",
                      id: item._id,
                      contentType: item.type,
                      title: item.title,
                      lectureId: lectureData._id,
                      content: item.content,
                      sectionId: section._id,
                      sectionIndex: index,
                      lectureIndex: lectureIndex,
                      status: false,
                    })
                  );

                  const finalContent = sectionAssessment
                    ? [...contentData, sectionAssessment]
                    : contentData;
                  //  sectionLectureContent.push(...finalContent);

                  return {
                    type: "lecture",
                    id: lectureData._id,
                    title: lectureData.name,
                    sectionIndex: index,
                    lectureIndex: lectureIndex,
                    content: finalContent,
                  };
                } catch (error) {
                  console.error(
                    `Error processing lecture ID ${lecture.id}:`,
                    error
                  );
                  return null; // Return null on error
                }
              })
            );

            // Filter out any null lecture data
            const validLectures = lectureContent.filter(
              (lecture) => lecture !== null
            );
            validLectures.sort((a, b) => a.lectureIndex - b.lectureIndex);
            const allContent = await Promise.all(
              validLectures.map((lecture) => lecture.content).flat()
            );

            // Create the final section object
            const sectionData = {
              type: "section",
              index: index,
              id: section._id,
              title: section.name,
              lectures: validLectures,
            };

            console.log("section.name after: ", section.name);

            // Push section data to sidebar and content arrays

            contentData.push(...allContent);

            return sectionData;
          })
        );
        sidebarData.push(...finalSectionData);
      }

      // Return final structured data
      return {
        courseName: course?.courseName,
        courseDescription: course?.courseDescription,
        coverImage: course?.coverImage,
        totalSections: course?.totalSections,
        totalLectures: course?.totalLectures,
        sidebarData: sidebarData,
        contentData: contentData.sort((a, b) => {
          if (a.sectionIndex !== b.sectionIndex) {
            return a.sectionIndex - b.sectionIndex;
          }
          return a.lectureIndex - b.lectureIndex;
        }),
      };
    } catch (error) {
      console.error("Error fetching published course data:", error);
      throw error; // Ensure errors are propagated
    }
  },

  // getCourseSidebarDataById: async (batchId, courseId) => {
  //   try {
  //     // Fetch courses where isPublish is true
  //     const course = await CourseModel.findOne({
  //       _id: courseId,
  //       isPublish: true,
  //     }).populate("sections.id", "_id name lectures");

  //     if (!course) {
  //       return "No published courses found.";
  //     }
  //     console.log("batchId : ", batchId);
  //     const assessmentData =
  //       await assignAssessmentServices.getAssessmentByBatchIdAndCourseId(
  //         courseId,
  //         batchId
  //       );
  //     // console.log("assessmentData : ", assessmentData);
  //     const sidebarData = [];
  //     const contentData = [];
  //     // check pre assessment data
  //     const getPreAssessment = getPreAssessmentDataByType(assessmentData);
  //     if (getPreAssessment) {
  //       sidebarData.push(getPreAssessment);
  //       contentData.push(getPreAssessment);
  //     }
  //     if (course?.sections.length) {
  //       // const sectionsData = await Promise.all(
  //       //   course.sections.map(async (info, index) => {
  //       //     const section = info.id;
  //       //     console.log("section.name before: ", section.name);

  //       //     const sectionLectureContent = [];
  //       //     // Use Promise.all to handle async mapping over lectures
  //       //     const lectureContent = await Promise.all(
  //       //       section.lectures.map(async (lecture, lectureIndex) => {
  //       //         const lectureData =
  //       //           await lecturesServices.getPublishLectureDataById(lecture.id);

  //       //         if (lectureData) {
  //       //           console.log("...............");
  //       //           const getSectionAssessment = getSectionAssessmentDataByType(
  //       //             assessmentData,
  //       //             lecture.id
  //       //           );
  //       //           // console.log("getSectionAssessment", getSectionAssessment);
  //       //           let finalContent = [];
  //       //           const contentData = lectureData.lectureContent.map((item) => {
  //       //             return {
  //       //               type: "content",
  //       //               id: item._id,
  //       //               contentType: item.type,
  //       //               title: item.title,
  //       //               lectureId: lectureData._id,
  //       //               sectionId: section._id,
  //       //               sectionIndex: index,
  //       //               lectureIndex: lectureIndex,
  //       //               status: false,
  //       //             };
  //       //           });
  //       //           if (getSectionAssessment) {
  //       //             finalContent = [...contentData, getSectionAssessment];
  //       //           } else {
  //       //             finalContent = [...contentData];
  //       //           }

  //       //           sectionLectureContent.push(...finalContent);

  //       //           return {
  //       //             type: "lecture",
  //       //             id: lectureData._id,
  //       //             title: lectureData.name,
  //       //             lectureIndex: lectureIndex,
  //       //             content: finalContent,
  //       //           };
  //       //         }

  //       //         return null;
  //       //       })
  //       //     );

  //       //     const validLectures = lectureContent.filter(
  //       //       (lecture) => lecture !== null
  //       //     );

  //       //     // Construct section data
  //       //     const sectionData = {
  //       //       type: "section",
  //       //       index: index,
  //       //       id: section._id,
  //       //       title: section.name,

  //       //       lectures: validLectures,
  //       //     };
  //       //     console.log("section.name after: ", section.name);
  //       //     sidebarData.push(sectionData);
  //       //     contentData.push(...sectionLectureContent);
  //       //     return sectionData;
  //       //   })
  //       // );

  //       await Promise.all(
  //         course.sections.map(async (info, index) => {
  //           const { id } = { ...info };
  //           const section = info.id; // Shallow copy to avoid mutation
  //           console.log("section.name before: ",id, section.name);

  //           const sectionLectureContent = [];

  //           // Fetch and process lectures for this section
  //           const lectureContent = await Promise.all(
  //             section.lectures.map(async (lecture, lectureIndex) => {
  //               const lectureData =
  //                 await lecturesServices.getPublishLectureDataById(lecture.id);

  //               if (lectureData) {
  //                 console.log("Processing lecture:", lectureData.name);

  //                 // Get section assessment data
  //                 const getSectionAssessment = getSectionAssessmentDataByType(
  //                   assessmentData,
  //                   lecture.id
  //                 );

  //                 // Process lecture content
  //                 const contentData = lectureData.lectureContent.map(
  //                   (item) => ({
  //                     type: "content",
  //                     id: item._id,
  //                     contentType: item.type,
  //                     title: item.title,
  //                     lectureId: lectureData._id,
  //                     sectionId: section._id,
  //                     sectionIndex: index, // Section order preserved
  //                     lectureIndex: lectureIndex, // Lecture order preserved
  //                     status: false,
  //                   })
  //                 );

  //                 // Merge content data with assessment if available
  //                 let finalContent = getSectionAssessment
  //                   ? [...contentData, getSectionAssessment]
  //                   : [...contentData];

  //                 // Accumulate lecture content for this section
  //                 sectionLectureContent.push(...finalContent);

  //                 return {
  //                   type: "lecture",
  //                   id: lectureData._id,
  //                   title: lectureData.name,
  //                   lectureIndex: lectureIndex, // Maintaining lecture order
  //                   content: finalContent,
  //                 };
  //               }

  //               return null; // If no lecture data, return null
  //             })
  //           );

  //           // Filter out any null lecture data
  //           const validLectures = lectureContent.filter(
  //             (lecture) => lecture !== null
  //           );

  //           // Create the final section object, maintaining section order
  //           const sectionData = {
  //             type: "section",
  //             index: index, // Section order maintained
  //             id: section._id,
  //             title: section.name,
  //             lectures: validLectures, // Maintain lecture order within section
  //           };

  //           console.log("section.name after: ", section.name);

  //           // Push section data to sidebar and content arrays
  //           sidebarData.push(sectionData);
  //           contentData.push(...sectionLectureContent);

  //           return sectionData;
  //         })
  //       );

  //       // Final ordered sections and lectures should now be properly aligned

  //       // Final ordered data should be preserved

  //       // console.log("sectionsData:", sectionsData);
  //     }
  //     return {
  //       courseName: course?.courseName,
  //       courseDescription: course?.courseDescription,
  //       coverImage: course?.coverImage,
  //       totalSections: course?.totalSections,
  //       totalLectures: course?.totalLectures,
  //       // sections: course?.sections,
  //       // assessmentData: assessmentData,
  //       sidebarData: sidebarData,
  //       contentData: contentData,
  //     };
  //     // return {
  //     //   courseName: course?.courseName,
  //     //   courseDescription: course?.courseDescription,
  //     //   coverImage: course?.coverImage,
  //     //   totalSections: course?.totalSections,
  //     //   totalLectures: course?.totalLectures,
  //     //   sections: course.sections?.map((section) => ({
  //     //     name: section.name,
  //     //     lecturesCount: section.lecturesCount,
  //     //     lectures: section.lectures.map((lecture) => ({
  //     //       name: lecture.name,
  //     //       lectureContent: lecture.lectureContent,
  //     //       publishDate: lecture.publishDate,
  //     //     })),
  //     //   })),
  //     //   publishDate: course.publishDate,
  //     // };
  //   } catch (error) {
  //     console.error("Error fetching published course data:", error);
  //     throw error;
  //   }
  // },
};
