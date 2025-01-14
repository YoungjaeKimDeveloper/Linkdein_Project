import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: { type: String, required: true, unique: true },
    email: { required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default: "",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    headline: {
      type: "String",
      default: "Linkdin User",
    },
    location: {
      type: String,
      default: "Sydney",
    },
    about: {
      type: String,
      default: "",
    },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
  },
  { timestamps }
);

export const User = mongoose.model("User", userSchema);

required: true;

// required: true, unique: true
