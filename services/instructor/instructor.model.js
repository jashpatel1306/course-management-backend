const mongoose = require("mongoose");
const { sendMailWithServices } = require("../../helpers/mail.helper");
const createError = require("http-errors");
const commonFunctions = require("../../helpers/commonFunctions");

// Define Instructor Schema
const InstructorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required."],
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "name is required."],
    },
    phone: {
      type: String,
      required: [true, "phone is required."],
      unique: true,
    },
    skills: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
      required: [true, "location is required."],
    },
    experienceInYears: {
      type: Number,
      required: [true, "experience is required."],
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: "colleges", // Reference to the College model
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users", // Reference to the User model
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Pre-save hook
InstructorSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("email")) {
    try {
      // Create or update user associated with this instructor
      // const password = commonHelpers.generateRandomPassword();
      const password = "Admin@123"; // Default password (should be hashed in a real scenario)

      const userData = {
        email: this.email,
        password: await commonFunctions.encode(password), // Encode password
        user_name: this.name,
        role: "instructor", // Adjust role as needed
      };
      console.log("userData", userData);
      const User = mongoose.model("users");

      // Upsert user
      await mongoose
        .model("users")
        .updateOne(
          { email: userData.email },
          { ...userData },
          { upsert: true }
        );
      const createUser = await mongoose
        .model("users")
        .findOne(
          { email: userData.email },
          { createdAt: 0, updatedAt: 0, __v: 0 }
        );
      if (!createUser) {
        next(createError.InternalServerError("Error creating user."));
      }
      // Associate user with instructor
      this.userId = createUser._id;

      // Send email notification
      const to = this.email;
      const subject = "Welcome to the Training Platform";
      const body = `Dear ${this.name},\n\nThank you for joining our platform. Your password for platform is ${password}.\n\nBest regards,\nThe Team`;

      await sendMailWithServices(to, subject, body);
    } catch (error) {
      return next(
        createError.InternalServerError("Error while instructor creation.")
      );
    }
  }
  next();
});

// Create and export the Instructor model
const InstructorModel = mongoose.model("instructors", InstructorSchema);
module.exports = InstructorModel;
