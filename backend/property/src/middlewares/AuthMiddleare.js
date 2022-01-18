const axios = require("axios");

const validateToken = async (req, res, next) => {
  try {
    const url = process.env.API_USER_URL;
    const token = req.headers?.authorization || req.headers?.Authorization;

    const response = await axios.post(`${url}/auth/token`, {
      token,
    });

    req.user = response.data?.data;
    next();
  } catch (error) {
    return res.json({ message: "Invalid Authentication!" });
  }
};

module.exports = { validateToken };
