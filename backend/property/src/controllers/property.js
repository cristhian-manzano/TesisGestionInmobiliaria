const { uploadFile, uploadMultipleFiles } = require("../services/awsService");
const { validateProperty } = require("../validations/property");
const Property = require("../models/property");
const ImagesProperty = require("../models/imageProperty");
const sequelize = require("../models");

const create = async (req, res) => {
  const { error, value } = validateProperty(req.body);
  if (error) return res.json({ message: error.message });

  try {
    const result = await sequelize.transaction(async (t) => {
      value.idOwner = +req.user?.id;
      const createdProperty = await Property.create(value, { transaction: t });
      const imagesUploaded = (await uploadMultipleFiles(req.files)) || [];

      if (imagesUploaded.length > 0) {
        await Promise.all(
          imagesUploaded.map(async (image) => {
            await ImagesProperty.create(
              {
                url: image.Location,
                key: image.Key || image.key,
                idProperty: createdProperty.id,
              },
              { transaction: t }
            );
          })
        );
      }

      return createdProperty;
    });

    return res.json({ created: result });
  } catch (e) {
    console.log("Error: ", e.message);
    res.json({ error: e.message });
  }
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
