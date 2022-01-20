// Multer
const multer = require('multer');

const upload = multer();
const uploadImages = upload.array('propertyImages', 10);

const multerMiddleware = (req, res, next) => {
  uploadImages(req, res, (err) => {
    if (err || err instanceof multer.MulterError)
      return res.status(400).json({ error: 'Cannot update fields' });

    return next();
  });
};

module.exports = { multerMiddleware };
