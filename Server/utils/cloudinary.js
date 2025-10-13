// backend/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// 1️⃣ Configure cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // your cloud name from Cloudinary dashboard
  api_key: process.env.CLOUDINARY_API_KEY,       // your API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // your secret key
});

// 2️⃣ Export the configured instance so you can use it anywhere in backend
export default cloudinary;
