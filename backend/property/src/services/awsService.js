require('dotenv').config();
const S3 = require('../config/awsConfig');

const uploadFiles = async (files) => {
  if (files === undefined) throw Error('files parameter indefined');

  if (files?.length) {
    return Promise.all(
      files.map(async (file) =>
        S3.upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: file.buffer,
          Key: `properties/${Date.now()}-${file.originalname}`
        }).promise()
      )
    );
  }

  return null;
};

const deleteFiles = async (files) => {
  if (files === undefined) throw Error('files parameter indefined');

  if (files?.length) {
    const keys = files.map((file) => ({ Key: file.key }));

    return S3.deleteObjects({
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: { Objects: keys }
    }).promise();
  }

  return null;
};

module.exports = {
  uploadFiles,
  deleteFiles
};
