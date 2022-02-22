require('dotenv').config();
const S3 = require('../config/awsConfig');

const uploadFile = async (file, folder) => {
  if (!file || !folder) throw Error('file and folder - parameters indefined');

  return S3.upload({
    Bucket: process.env.AWS_BUCKET_NAME,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: `${folder}/${Date.now()}-${file.originalname}`
  }).promise();
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
  uploadFile,
  deleteFiles
};
