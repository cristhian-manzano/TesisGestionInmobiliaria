const Sector = require("../models/sector");

const get = async (req, res) => {
  try {
    const sectors = await Sector.findAll();
    return res.json({ data: sectors });
  } catch (error) {
    console.log("ERROR MESSAGE; ", error.message);
    return res.send("error");
  }
};

module.exports = {
  get,
};
