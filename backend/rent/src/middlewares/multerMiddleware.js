// Multer
const multer = require('multer');

const upload = multer();

const multerMiddleware = (fileName) => (req, res, next) => {
  const uploadImages = upload.single(fileName);

  uploadImages(req, res, (err) => {
    if (err || err instanceof multer.MulterError)
      return res.status(400).json({ error: 'Cannot get fields' });

    return next();
  });
};

module.exports = { multerMiddleware };
