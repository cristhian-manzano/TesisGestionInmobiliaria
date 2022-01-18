require("dotenv").config();
const S3 = require("../config/awsConfig");

const upload = (file) => {
  return S3.upload({
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: file.buffer,
    Key: file.originalname,
  }).promise();
};

module.exports = { upload };
