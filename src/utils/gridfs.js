import mongoose from "mongoose";

let gfsBucket;
const conn = mongoose.connection;

conn.once("open", () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "paid_books",
  });
});

export const getFileFromGridFS = (fileId) => {
  return new Promise((resolve, reject) => {
    if (!gfsBucket) return reject(new Error("GridFSBucket is not initialized"));

    try {
      const fileStream = gfsBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
      resolve(fileStream);
    } catch (error) {
      reject(error);
    }
  });
};
