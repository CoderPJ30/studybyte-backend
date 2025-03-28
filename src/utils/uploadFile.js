import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB Connection for GridFS
const conn = mongoose.connection;
let gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "paid_books" });
});

// Upload File (Path or Buffer)
const uploadFile = async (file, folder, isPaid = false) => {
  if (!file) return null;

  if (isPaid) {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
      const uploadStream = gridFSBucket.openUploadStream(filename);
      streamifier.createReadStream(file).pipe(uploadStream);

      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });
  } else {
    const options = { folder, resource_type: "raw" };

    return new Promise((resolve, reject) => {
      streamifier.createReadStream(file).pipe(
        cloudinary.uploader.upload_stream(options, (err, result) =>
          err ? reject(err) : resolve(result.secure_url)
        )
      );
    });
  }
};

export { uploadFile };
