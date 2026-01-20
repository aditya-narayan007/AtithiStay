const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME.trim(),
  api_key: process.env.CLOUD_API_KEY.trim(),
  api_secret: process.env.CLOUD_API_SECRET.trim(),
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "AtithiStay",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = { cloudinary, storage };