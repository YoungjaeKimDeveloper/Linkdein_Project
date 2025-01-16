import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "/Users/youngjaekim/Desktop/Linkedin_Clone/.env" });
cloudinary.config({
  cloud_name: process.env.Cloudinary_API_Name,
  api_key: process.env.Cloudinary_API_KEY,
  api_secret: process.env.Cloudinary_API_SecretKey,
});

export default cloudinary;
