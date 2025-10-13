import streamifier from "streamifier";
import cloudinary from "./cloudinary.js";

/**
 * Upload a file buffer (from Multer memory) to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer (req.file.buffer or req.files[i].buffer)
 * @param {string} folder - Folder name inside Cloudinary
 * @returns {Promise<string>} - Returns the Cloudinary secure URL
 */

export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    // Create a Cloudinary upload stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder, // folder name in your Cloudinary account
        resource_type: "auto", // auto-detects image/video
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url); // Return the uploaded image URL
      }
    );

    // Convert the buffer into a readable stream and pipe it to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
