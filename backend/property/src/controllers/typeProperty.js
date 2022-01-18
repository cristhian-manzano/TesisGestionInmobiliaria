const TypeProperty = require("../models/typeProperty");

const get = async (req, res) => {
  try {
    const typesProperty = await TypeProperty.findAll();
    return res.json({ data: typesProperty });
  } catch (error) {
    console.log("ERROR MESSAGE; ", error.message);
    return res.send("error");
  }
};

module.exports = {
  get,
};
