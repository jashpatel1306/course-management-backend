const mongoose = require("mongoose");
const lecturesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
    ref: "sections",
  },
  description: {
    type: String,
    required: true,
  },
  lectureContent: [
    {
      type: {
        type: String,
        required: true,
        enum: ["video", "text"],
      },
      content: {
        type: String,
        required: true,
      },
      title: {
        type: String,
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  publishDate: {
    type: Date,
  },
}); 


lecturesSchema.post("save",async function(){
  try {
    
  } catch (err) {
    console.log("error updating ")
  }
})
const lecturesModel = mongoose.model("lectures", lecturesSchema);
module.exports = lecturesModel;
