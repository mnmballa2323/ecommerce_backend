const mongoose = require("mongoose");
const validator = require("validator");

const blogSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    author: {
      type: String,
    },
    authorEmail: {
      type: String,
    },
    category: {
      type: String,
      // required: [true, "Please provide a blog category"],
      enum: {
        values: [
          "Beauty & Wellness",
          "Fashion",
          "Fitness and Exercise",
          "Food and Cooking",
          "Gaming and eSports",
          "Gift Ideas",
          "Home & Living",
          "Latest Trends",
          "Mental Health",
          "Quantum Quests",
          "Style Tips",
          "Tech Talk",
          "Technology and Gadgets",
        ],
        message: 'Invalid category',
      },
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      trim: true,
      lowercase: true
    },
    date: {
      type: Date
    },
    description: [{ content1: String },
    ],
    img: {
      type: String,
      // required: [true, "Blog image is required"],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);


const Blogs = mongoose.model("Blogs", blogSchema);



module.exports = Blogs;
