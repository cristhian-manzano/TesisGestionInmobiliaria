const { uploadFile, uploadMultipleFiles } = require("../services/awsService");

const { validateProperty } = require("../validations/property");

const Property = require("../models/property");
const ImagesProperty = require("../models/imageProperty");

const create = async (req, res) => {
  const { error, value } = validateProperty(req.body);
  if (error) return res.json({ message: error.message });

  // Values body
  console.log(value);

  try {
    const result = await uploadMultipleFiles(req.files);
    if (result.length > 0) return res.json({ uploaded: result });
  } catch (e) {
    console.log("Error: ", e);
  }

  return res.json(req.body);
};

const get = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: {
        model: ImagesProperty,
        as: "ImagesProperties",
        attributes: {
          exclude: ["idProperty"],
        },
      },
    });

    console.log("TIPO DATO: ", typeof properties[0].idOwner);

    return res.json({ data: properties });
  } catch (error) {
    console.log("ERROR MESSAGE; ", error.message);
    return res.send("error");
  }
};

// const update = (req, res) => {};
// const destroy = (req, res) => {};

module.exports = {
  get,
  create,
  // update,
  // destroy
};
