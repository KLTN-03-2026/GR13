import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: process.env.CLOUDINARY_FOLDER || "Tech-Spa",
      format: "jpg", // hoặc 'png', 'webp', v.v.
      public_id: file.originalname.split(".")[0] + "-" + Date.now(),
    };
  },
});

const uploadCloud = multer({ storage });

export default uploadCloud;
