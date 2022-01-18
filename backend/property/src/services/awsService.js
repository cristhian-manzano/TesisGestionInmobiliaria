require("dotenv").config();
const S3 = require("../config/awsConfig");

const uploadFile = async (file) => {
  return S3.upload({
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: file.buffer,
    Key: `${Date.now()}-${file.originalname}`,
  }).promise();
};

const uploadMultipleFiles = async (files) => {
  if (files === undefined) throw Error("files parameter indefined");

  if (files?.length) {
    return Promise.all(
      files.map(async (file) => {
        return uploadFile(file);
      })
    );
  } else {
    return [];
  }
};

module.exports = { uploadFile, uploadMultipleFiles };
