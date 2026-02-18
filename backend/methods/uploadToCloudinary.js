import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * Uploads a file to Cloudinary and deletes the local temporary file.
 * @param {string} localFilePath - Path to the local file.
 * @param {string} folder - Cloudinary folder name.
 * @returns {Promise<string>} - The secure URL of the uploaded file.
 */
export const uploadToCloudinary = async (localFilePath, folder = "movi_booking") => {
  try {
    if (!localFilePath) return "";
    
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folder,
      resource_type: "auto", // Automatically detect image or video
    });

    // Delete local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    // Still try to delete local file even if upload fails to avoid clogging
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};
