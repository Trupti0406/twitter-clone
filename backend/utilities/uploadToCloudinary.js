const cloudinary = require("cloudinary");

const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    // Uploading the file to Cloudinary using the uploader.upload method
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
      /* The resource_type:'auto', allows Cloudinary to automatically detect 
          the resource type based on the uploaded file. */
    });
    // Returning the secure URL of the uploaded image
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};

module.exports = cloudinaryUploadImg;
