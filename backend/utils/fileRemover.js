import cloudinary from "../config/cloudinaryConfig.js";

export const fileRemover = async (imageUrl) => {
  try {
    // Extract Cloudinary public ID from URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(`uploads/${publicId}`);

    console.log(`Image ${imageUrl} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
