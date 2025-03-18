import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload File (Path or Buffer)
const uploadFile = async (file) => {
  if (!file) return null;

  const options = { folder: "StudyByte", resource_type: "auto" };

  return typeof file === "string"
    ? cloudinary.uploader.upload(file, options) // Upload from path
    : new Promise((resolve, reject) => {
      streamifier.createReadStream(file).pipe(
        cloudinary.uploader.upload_stream(options, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      );
    }); // Upload from buffer
};

export { uploadFile };
