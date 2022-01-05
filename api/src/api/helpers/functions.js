require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const encryptData = async (value) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(value, salt);
};

const verifyEncrypted = async (value, hash) => bcrypt.compare(value, hash);

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 86400
  });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createToken,
  verifyToken,
  encryptData,
  verifyEncrypted
};
